// /home/ubuntu/easyplanningpro-v2/server/routers/__tests__/subscriptions.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import {
  subscriptionsRouter,
  createCaller,
  mockDb,
  mockContext,
  mockUser,
} from '../../../../subscriptions.mock'; // Assuming subscriptions.mock.ts is one level up from __tests__

// Helper to create a caller for the router
const createTestCaller = (user: typeof mockUser | null = mockUser) =>
  createCaller(mockContext(user));

describe('Subscriptions Router', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Mock Data ---
  const mockSubscription = {
    id: 'sub-123',
    userId: mockUser.id,
    plan: 'pro',
    status: 'active',
    startDate: new Date(),
    endDate: null,
  };

  // =========================================================================
  // 1. CRUD Operations Tests
  // =========================================================================
  describe('CRUD Operations', () => {
    const caller = createTestCaller();

    // 1.1 CREATE Test
    it('should successfully create a new subscription (CREATE)', async () => {
      const input = { plan: 'basic', userId: mockUser.id };
      const createdSub = { ...mockSubscription, id: 'mock-sub-id', plan: input.plan };
      
      // Mock the database call
      mockDb.subscription.create.mockResolvedValue(createdSub);

      const result = await caller.create(input);

      expect(mockDb.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            plan: input.plan,
            userId: input.userId,
          }),
        })
      );
      expect(result).toEqual(createdSub);
    });

    // 1.2 READ Test (getById)
    it('should successfully retrieve a subscription by ID (READ)', async () => {
      const input = { id: mockSubscription.id };

      // Mock the database call
      mockDb.subscription.findUnique.mockResolvedValue(mockSubscription);

      const result = await caller.getById(input);

      expect(mockDb.subscription.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: input.id } })
      );
      expect(result).toEqual(mockSubscription);
    });

    // 1.3 UPDATE Test
    it('should successfully update a subscription (UPDATE)', async () => {
      const input = { id: mockSubscription.id, status: 'canceled' as const };
      const updatedSub = { ...mockSubscription, status: input.status };

      // Mock the database calls
      mockDb.subscription.findUnique.mockResolvedValue(mockSubscription); // Check existence
      mockDb.subscription.update.mockResolvedValue(updatedSub);

      const result = await caller.update(input);

      expect(mockDb.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: input.id },
          data: { status: input.status },
        })
      );
      expect(result).toEqual(updatedSub);
    });

    // 1.4 DELETE Test
    it('should successfully delete a subscription (DELETE)', async () => {
      const input = { id: mockSubscription.id };

      // Mock the database call
      mockDb.subscription.delete.mockResolvedValue(mockSubscription);

      const result = await caller.delete(input);

      expect(mockDb.subscription.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: input.id } })
      );
      expect(result).toEqual(mockSubscription);
    });
  });

  // =========================================================================
  // 2. Input Validation (Zod Schemas) Tests
  // =========================================================================
  describe('Input Validation', () => {
    const caller = createTestCaller();

    // 2.1 CREATE validation failure
    it('should throw a ZodError for invalid input on CREATE', async () => {
      // @ts-ignore - Intentionally passing invalid data
      const invalidInput = { plan: 'invalid-plan', userId: mockUser.id };

      await expect(caller.create(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(caller.create(invalidInput as any)).rejects.toThrow(
        expect.objectContaining({ code: 'BAD_REQUEST' })
      );
    });

    // 2.2 READ validation failure
    it('should throw a ZodError for invalid ID format on READ', async () => {
      const invalidInput = { id: 'not-a-uuid' };

      await expect(caller.getById(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(caller.getById(invalidInput as any)).rejects.toThrow(
        expect.objectContaining({ code: 'BAD_REQUEST' })
      );
    });
  });

  // =========================================================================
  // 3. Authentication/Authorization Tests
  // =========================================================================
  describe('Authentication/Authorization Checks', () => {
    const adminCaller = createTestCaller();
    const unauthedCaller = createTestCaller(null);
    const nonAdminUser = { id: 'user-456', role: 'user' };
    const userCaller = createTestCaller(nonAdminUser);

    // 3.1 Unauthenticated access (Middleware check)
    it('should throw UNAUTHORIZED for unauthenticated users on authed procedures (CREATE)', async () => {
      const input = { plan: 'basic', userId: mockUser.id };
      await expect(unauthedCaller.create(input)).rejects.toThrow(TRPCError);
      await expect(unauthedCaller.create(input)).rejects.toThrow(
        expect.objectContaining({ code: 'UNAUTHORIZED' })
      );
    });

    // 3.2 Authorization check (READ - Forbidden)
    it('should throw FORBIDDEN when a user tries to read another user\'s subscription', async () => {
      const anotherUserSub = { ...mockSubscription, userId: 'another-user-id' };
      const input = { id: anotherUserSub.id };

      // Mock the database call to return a subscription belonging to another user
      mockDb.subscription.findUnique.mockResolvedValue(anotherUserSub);

      await expect(userCaller.getById(input)).rejects.toThrow(TRPCError);
      await expect(userCaller.getById(input)).rejects.toThrow(
        expect.objectContaining({ code: 'FORBIDDEN' })
      );
    });

    // 3.3 Authorization check (UPDATE - Forbidden for non-admin)
    it('should throw FORBIDDEN when a non-admin user tries to UPDATE', async () => {
      const input = { id: mockSubscription.id, status: 'canceled' as const };
      
      // Mock the existence check
      mockDb.subscription.findUnique.mockResolvedValue(mockSubscription);

      await expect(userCaller.update(input)).rejects.toThrow(TRPCError);
      await expect(userCaller.update(input)).rejects.toThrow(
        expect.objectContaining({ code: 'FORBIDDEN' })
      );
    });
    
    // 3.4 Authorization check (DELETE - Forbidden for non-admin)
    it('should throw FORBIDDEN when a non-admin user tries to DELETE', async () => {
      const input = { id: mockSubscription.id };

      await expect(userCaller.delete(input)).rejects.toThrow(TRPCError);
      await expect(userCaller.delete(input)).rejects.toThrow(
        expect.objectContaining({ code: 'FORBIDDEN' })
      );
    });
  });

  // =========================================================================
  // 4. Error Handling and Edge Cases Tests
  // =========================================================================
  describe('Error Handling and Edge Cases', () => {
    const caller = createTestCaller();

    // 4.1 Error Handling (CREATE - Internal Server Error)
    it('should handle and throw INTERNAL_SERVER_ERROR when DB fails on CREATE', async () => {
      const input = { plan: 'basic', userId: mockUser.id };
      
      // Mock the database call to throw an error
      mockDb.subscription.create.mockRejectedValue(new Error('DB connection lost'));

      await expect(caller.create(input)).rejects.toThrow(TRPCError);
      await expect(caller.create(input)).rejects.toThrow(
        expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' })
      );
    });

    // 4.2 Edge Case (READ - Not Found)
    it('should throw NOT_FOUND when subscription ID does not exist (READ)', async () => {
      const input = { id: 'non-existent-id' };

      // Mock the database call to return null
      mockDb.subscription.findUnique.mockResolvedValue(null);

      await expect(caller.getById(input)).rejects.toThrow(TRPCError);
      await expect(caller.getById(input)).rejects.toThrow(
        expect.objectContaining({ code: 'NOT_FOUND', message: 'Subscription not found' })
      );
    });

    // 4.3 Edge Case (UPDATE - Not Found)
    it('should throw NOT_FOUND when subscription ID does not exist (UPDATE)', async () => {
      const input = { id: 'non-existent-id', status: 'canceled' as const };
      
      // Mock the existence check to return null
      mockDb.subscription.findUnique.mockResolvedValue(null);

      await expect(caller.update(input)).rejects.toThrow(TRPCError);
      await expect(caller.update(input)).rejects.toThrow(
        expect.objectContaining({ code: 'NOT_FOUND', message: 'Subscription not found' })
      );
    });

    // 4.4 Edge Case (DELETE - Not Found)
    it('should throw NOT_FOUND when subscription ID does not exist (DELETE)', async () => {
      const input = { id: 'non-existent-id' };
      
      // Mock the database call to throw an error (simulating Prisma's record not found on delete)
      mockDb.subscription.delete.mockRejectedValue(new Error('Record to delete does not exist.'));

      await expect(caller.delete(input)).rejects.toThrow(TRPCError);
      await expect(caller.delete(input)).rejects.toThrow(
        expect.objectContaining({ code: 'NOT_FOUND', message: 'Subscription not found for deletion' })
      );
    });

    // 4.5 Edge Case (UPDATE - No data provided)
    it('should allow UPDATE with only ID and no optional fields (no-op)', async () => {
      const input = { id: mockSubscription.id };
      
      // Mock the database calls
      mockDb.subscription.findUnique.mockResolvedValue(mockSubscription); // Check existence
      mockDb.subscription.update.mockResolvedValue(mockSubscription);

      const result = await caller.update(input);

      expect(mockDb.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: input.id },
          data: {}, // Should pass an empty object to update if no optional fields are provided
        })
      );
      expect(result).toEqual(mockSubscription);
    });
  });
});

// Total number of tests: 14 (4 CRUD + 2 Validation + 5 Auth/Auth + 3 Edge/Error)
// Note: The total count of `it` blocks is 14.

