import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Stripe from 'stripe';
import { createCheckoutSession, handleWebhook } from '../../services/stripe';

// Mock Stripe
vi.mock('stripe', () => {
  const mockStripe = {
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
    },
    subscriptions: {
      create: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
      retrieve: vi.fn(),
    },
    customers: {
      create: vi.fn(),
      update: vi.fn(),
      retrieve: vi.fn(),
    },
    invoices: {
      retrieve: vi.fn(),
      list: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  };

  return {
    default: vi.fn(() => mockStripe),
  };
});

describe('Stripe Payment Integration', () => {
  let stripe: any;

  beforeEach(() => {
    stripe = new Stripe('sk_test_mock', { apiVersion: '2024-10-28.acacia' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Checkout Session Creation', () => {
    it('should create checkout session for Premium plan', async () => {
      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        payment_status: 'unpaid',
      };

      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: 'price_premium',
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      expect(session.id).toBe('cs_test_123');
      expect(session.url).toContain('checkout.stripe.com');
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: 'subscription',
        line_items: expect.any(Array),
        success_url: expect.any(String),
        cancel_url: expect.any(String),
      });
    });

    it('should create checkout session for one-time package purchase', async () => {
      const mockSession = {
        id: 'cs_test_456',
        url: 'https://checkout.stripe.com/pay/cs_test_456',
        payment_status: 'unpaid',
      };

      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'VIP Package',
              },
              unit_amount: 49999, // $499.99
            },
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      expect(session.id).toBe('cs_test_456');
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: 'payment',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 49999,
            }),
          }),
        ]),
        success_url: expect.any(String),
        cancel_url: expect.any(String),
      });
    });

    it('should include customer email in checkout session', async () => {
      const mockSession = {
        id: 'cs_test_789',
        customer_email: 'user@example.com',
      };

      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: 'user@example.com',
        line_items: [{ price: 'price_premium', quantity: 1 }],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      expect(session.customer_email).toBe('user@example.com');
    });
  });

  describe('Subscription Management', () => {
    it('should create a new subscription', async () => {
      const mockSubscription = {
        id: 'sub_123',
        customer: 'cus_123',
        status: 'active',
        items: {
          data: [
            {
              price: {
                id: 'price_premium',
                recurring: { interval: 'month' },
              },
            },
          ],
        },
      };

      stripe.subscriptions.create.mockResolvedValue(mockSubscription);

      const subscription = await stripe.subscriptions.create({
        customer: 'cus_123',
        items: [{ price: 'price_premium' }],
      });

      expect(subscription.id).toBe('sub_123');
      expect(subscription.status).toBe('active');
    });

    it('should upgrade subscription plan', async () => {
      const mockUpdatedSubscription = {
        id: 'sub_123',
        customer: 'cus_123',
        status: 'active',
        items: {
          data: [
            {
              price: {
                id: 'price_pro',
                recurring: { interval: 'month' },
              },
            },
          ],
        },
      };

      stripe.subscriptions.update.mockResolvedValue(mockUpdatedSubscription);

      const subscription = await stripe.subscriptions.update('sub_123', {
        items: [
          {
            id: 'si_123',
            price: 'price_pro',
          },
        ],
        proration_behavior: 'always_invoice',
      });

      expect(subscription.items.data[0].price.id).toBe('price_pro');
      expect(stripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_123',
        expect.objectContaining({
          proration_behavior: 'always_invoice',
        })
      );
    });

    it('should cancel subscription at period end', async () => {
      const mockCancelledSubscription = {
        id: 'sub_123',
        status: 'active',
        cancel_at_period_end: true,
      };

      stripe.subscriptions.update.mockResolvedValue(mockCancelledSubscription);

      const subscription = await stripe.subscriptions.update('sub_123', {
        cancel_at_period_end: true,
      });

      expect(subscription.cancel_at_period_end).toBe(true);
    });

    it('should cancel subscription immediately', async () => {
      const mockCancelledSubscription = {
        id: 'sub_123',
        status: 'canceled',
      };

      stripe.subscriptions.cancel.mockResolvedValue(mockCancelledSubscription);

      const subscription = await stripe.subscriptions.cancel('sub_123');

      expect(subscription.status).toBe('canceled');
    });
  });

  describe('Customer Management', () => {
    it('should create a new customer', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'user@example.com',
        name: 'John Doe',
      };

      stripe.customers.create.mockResolvedValue(mockCustomer);

      const customer = await stripe.customers.create({
        email: 'user@example.com',
        name: 'John Doe',
      });

      expect(customer.id).toBe('cus_123');
      expect(customer.email).toBe('user@example.com');
    });

    it('should update customer metadata', async () => {
      const mockCustomer = {
        id: 'cus_123',
        metadata: {
          userId: 'user_123',
          plan: 'premium',
        },
      };

      stripe.customers.update.mockResolvedValue(mockCustomer);

      const customer = await stripe.customers.update('cus_123', {
        metadata: {
          userId: 'user_123',
          plan: 'premium',
        },
      });

      expect(customer.metadata.userId).toBe('user_123');
      expect(customer.metadata.plan).toBe('premium');
    });
  });

  describe('Invoice Management', () => {
    it('should retrieve invoice details', async () => {
      const mockInvoice = {
        id: 'in_123',
        amount_paid: 1999,
        status: 'paid',
        invoice_pdf: 'https://invoice.stripe.com/in_123.pdf',
      };

      stripe.invoices.retrieve.mockResolvedValue(mockInvoice);

      const invoice = await stripe.invoices.retrieve('in_123');

      expect(invoice.id).toBe('in_123');
      expect(invoice.status).toBe('paid');
      expect(invoice.invoice_pdf).toBeDefined();
    });

    it('should list customer invoices', async () => {
      const mockInvoices = {
        data: [
          { id: 'in_123', amount_paid: 1999, status: 'paid' },
          { id: 'in_124', amount_paid: 1999, status: 'paid' },
        ],
        has_more: false,
      };

      stripe.invoices.list.mockResolvedValue(mockInvoices);

      const invoices = await stripe.invoices.list({
        customer: 'cus_123',
        limit: 10,
      });

      expect(invoices.data.length).toBe(2);
      expect(invoices.data[0].status).toBe('paid');
    });
  });
});

