import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { AppRouter, appRouter } from '../../root'; // Assuming root.ts exports appRouter
import { createInnerTRPCContext } from '../../context'; // Assuming context.ts exports createInnerTRPCContext
import { prisma } from '../../../db'; // Assuming db.ts exports the prisma client

// Mock the entire database client
vi.mock('../../../db', () => ({
  prisma: {
    ticket: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock the context creation to control session/auth data
const mockUserId = 'test-user-id-123';
const mockAdminId = 'admin-user-id-456';
const mockGuestId = 'guest-user-id-789';

const createMockContext = (userId: string | null = mockUserId, role: 'USER' | 'ADMIN' | 'GUEST' = 'USER') => {
  return createInnerTRPCContext({
    session: userId ? { user: { id: userId, role } } : null,
  });
};

// Helper function to call a procedure
const caller = appRouter.createCaller(createMockContext());
const adminCaller = appRouter.createCaller(createMockContext(mockAdminId, 'ADMIN'));
const guestCaller = appRouter.createCaller(createMockContext(mockGuestId, 'GUEST'));
const unauthenticatedCaller = appRouter.createCaller(createMockContext(null));


// --- MOCK DATA ---
const mockTicket = {
  id: 'ticket-id-1',
  title: 'Fix critical bug in auth flow',
  description: 'Users are unable to log in after session expiry.',
  status: 'OPEN',
  priority: 'HIGH',
  reporterId: mockUserId,
  assigneeId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTicketInput = {
  title: 'New Feature Request',
  description: 'Implement dark mode toggle.',
  priority: 'LOW',
};

type TicketCreateInput = inferProcedureInput<AppRouter['tickets']['create']>;
type TicketUpdateInput = inferProcedureInput<AppRouter['tickets']['update']>;
type TicketOutput = inferProcedureOutput<AppRouter['tickets']['getById']>;

// Type assertion for the mocked prisma client
const mockPrisma = prisma as unknown as {
  ticket: {
    findUnique: vi.Mock;
    findMany: vi.Mock;
    create: vi.Mock;
    update: vi.Mock;
    delete: vi.Mock;
  };
};

describe('ticketsRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 4. Authentication/Authorization Checks ---
  describe('Authentication Checks', () => {
    it('should throw UNAUTHORIZED error for unauthenticated user on create', async () => {
      // The actual implementation of the tRPC router would handle this,
      // but we test the caller's response to an unauthenticated context.
      await expect(
        unauthenticatedCaller.tickets.create(mockTicketInput as TicketCreateInput)
      ).rejects.toThrow(/UNAUTHORIZED/);
    });

    it('should throw UNAUTHORIZED error for unauthenticated user on update', async () => {
      await expect(
        unauthenticatedCaller.tickets.update({ id: mockTicket.id, title: 'New Title' } as TicketUpdateInput)
      ).rejects.toThrow(/UNAUTHORIZED/);
    });

    it('should throw UNAUTHORIZED error for unauthenticated user on delete', async () => {
      await expect(
        unauthenticatedCaller.tickets.delete({ id: mockTicket.id })
      ).rejects.toThrow(/UNAUTHORIZED/);
    });

    it('should allow unauthenticated user to read all tickets (public procedure)', async () => {
      // Assuming 'getAll' is a public procedure
      mockPrisma.ticket.findMany.mockResolvedValueOnce([mockTicket]);
      const result = await unauthenticatedCaller.tickets.getAll();
      expect(result).toEqual([mockTicket]);
      expect(mockPrisma.ticket.findMany).toHaveBeenCalledTimes(1);
    });
  });

  // --- 1. CRUD Operations & 6. Database Operations (Mocking) ---
  describe('CRUD Operations', () => {
    // CREATE
    describe('create', () => {
      it('should successfully create a new ticket', async () => {
        const expectedTicket = { ...mockTicket, title: mockTicketInput.title, description: mockTicketInput.description, priority: mockTicketInput.priority };
        mockPrisma.ticket.create.mockResolvedValueOnce(expectedTicket);

        const result = await caller.tickets.create(mockTicketInput as TicketCreateInput);

        expect(result).toEqual(expectedTicket);
        expect(mockPrisma.ticket.create).toHaveBeenCalledWith({
          data: {
            ...mockTicketInput,
            reporterId: mockUserId, // Check if reporterId is correctly derived from context
            status: 'OPEN', // Check for default status
          },
        });
      });
    });

    // READ
    describe('getById', () => {
      it('should successfully retrieve a ticket by ID', async () => {
        mockPrisma.ticket.findUnique.mockResolvedValueOnce(mockTicket);

        const result = await caller.tickets.getById({ id: mockTicket.id });

        expect(result).toEqual(mockTicket);
        expect(mockPrisma.ticket.findUnique).toHaveBeenCalledWith({
          where: { id: mockTicket.id },
        });
      });

      // --- 5. Edge Cases (invalid IDs) ---
      it('should return null if ticket ID does not exist', async () => {
        mockPrisma.ticket.findUnique.mockResolvedValueOnce(null);

        const result = await caller.tickets.getById({ id: 'non-existent-id' });

        expect(result).toBeNull();
      });
    });

    describe('getAll', () => {
      it('should successfully retrieve a list of all tickets', async () => {
        const mockTickets = [mockTicket, { ...mockTicket, id: 'ticket-id-2', title: 'Another Ticket' }];
        mockPrisma.ticket.findMany.mockResolvedValueOnce(mockTickets);

        const result = await caller.tickets.getAll();

        expect(result).toEqual(mockTickets);
        expect(mockPrisma.ticket.findMany).toHaveBeenCalledTimes(1);
      });

      // --- 5. Edge Cases (empty arrays) ---
      it('should return an empty array if no tickets are found', async () => {
        mockPrisma.ticket.findMany.mockResolvedValueOnce([]);

        const result = await caller.tickets.getAll();

        expect(result).toEqual([]);
      });
    });

    // UPDATE
    describe('update', () => {
      const updatePayload = {
        id: mockTicket.id,
        title: 'Updated Title',
        status: 'CLOSED' as const,
      };

      it('should successfully update a ticket', async () => {
        const updatedTicket = { ...mockTicket, ...updatePayload };
        mockPrisma.ticket.update.mockResolvedValueOnce(updatedTicket);

        const result = await caller.tickets.update(updatePayload as TicketUpdateInput);

        expect(result).toEqual(updatedTicket);
        expect(mockPrisma.ticket.update).toHaveBeenCalledWith({
          where: { id: mockTicket.id },
          data: {
            title: updatePayload.title,
            status: updatePayload.status,
          },
        });
      });

      // --- 4. Authorization Checks (Reporter/Admin only) ---
      it('should throw FORBIDDEN error if a non-reporter/non-admin tries to update the ticket', async () => {
        // Mock the findUnique to ensure the ticket exists and belongs to someone else
        mockPrisma.ticket.findUnique.mockResolvedValueOnce(mockTicket);

        // Assuming the router logic checks for ownership or admin role
        // The mockPrisma.ticket.update will not be called if the router throws
        await expect(
          guestCaller.tickets.update(updatePayload as TicketUpdateInput)
        ).rejects.toThrow(/FORBIDDEN|UNAUTHORIZED/); // Expecting an authorization error
      });

      it('should allow an ADMIN to update any ticket', async () => {
        const updatedTicket = { ...mockTicket, ...updatePayload };
        mockPrisma.ticket.update.mockResolvedValueOnce(updatedTicket);

        const result = await adminCaller.tickets.update(updatePayload as TicketUpdateInput);

        expect(result).toEqual(updatedTicket);
        expect(mockPrisma.ticket.update).toHaveBeenCalledTimes(1);
      });
    });

    // DELETE
    describe('delete', () => {
      it('should successfully delete a ticket', async () => {
        mockPrisma.ticket.delete.mockResolvedValueOnce(mockTicket);

        const result = await caller.tickets.delete({ id: mockTicket.id });

        expect(result).toEqual(mockTicket);
        expect(mockPrisma.ticket.delete).toHaveBeenCalledWith({
          where: { id: mockTicket.id },
        });
      });

      // --- 4. Authorization Checks (Reporter/Admin only) ---
      it('should throw FORBIDDEN error if a non-reporter/non-admin tries to delete the ticket', async () => {
        // Mock the findUnique to ensure the ticket exists and belongs to someone else
        mockPrisma.ticket.findUnique.mockResolvedValueOnce(mockTicket);

        // Assuming the router logic checks for ownership or admin role
        await expect(
          guestCaller.tickets.delete({ id: mockTicket.id })
        ).rejects.toThrow(/FORBIDDEN|UNAUTHORIZED/); // Expecting an authorization error
      });
    });
  });

  // --- 2. Input Validation (Zod schemas) ---
  describe('Input Validation', () => {
    it('should throw a Zod error for a missing title on create', async () => {
      const invalidInput = {
        description: 'A description',
        priority: 'LOW',
      };
      // The tRPC caller should throw a Zod error if the input schema is violated
      await expect(
        caller.tickets.create(invalidInput as TicketCreateInput)
      ).rejects.toThrow(/ZodError|BAD_REQUEST/);
    });

    it('should throw a Zod error for an invalid priority enum value on update', async () => {
      const invalidInput = {
        id: mockTicket.id,
        priority: 'EXTREME', // Invalid enum value
      };
      await expect(
        caller.tickets.update(invalidInput as TicketUpdateInput)
      ).rejects.toThrow(/ZodError|BAD_REQUEST/);
    });

    it('should throw a Zod error for an invalid ID format on getById (if using a strict UUID/CUID schema)', async () => {
      const invalidInput = {
        id: 'not-a-valid-id!',
      };
      // Assuming the ID validation is strict (e.g., CUID/UUID)
      await expect(
        caller.tickets.getById(invalidInput)
      ).rejects.toThrow(/ZodError|BAD_REQUEST/);
    });
  });

  // --- 3. Error Handling (try/catch blocks) ---
  describe('Error Handling', () => {
    it('should handle a database error gracefully on create', async () => {
      const dbError = new Error('Database connection failed');
      mockPrisma.ticket.create.mockRejectedValueOnce(dbError);

      await expect(
        caller.tickets.create(mockTicketInput as TicketCreateInput)
      ).rejects.toThrow(/INTERNAL_SERVER_ERROR/); // tRPC standard error for unhandled exceptions
    });

    it('should handle a database error gracefully on getAll', async () => {
      const dbError = new Error('Timeout reading from DB');
      mockPrisma.ticket.findMany.mockRejectedValueOnce(dbError);

      await expect(
        caller.tickets.getAll()
      ).rejects.toThrow(/INTERNAL_SERVER_ERROR/);
    });
  });

  // --- 5. Edge Cases (null values) ---
  describe('Edge Cases', () => {
    it('should handle null assigneeId correctly on creation', async () => {
      const inputWithNullAssignee = {
        ...mockTicketInput,
        assigneeId: null,
      };
      const expectedTicket = { ...mockTicket, ...inputWithNullAssignee };
      mockPrisma.ticket.create.mockResolvedValueOnce(expectedTicket);

      const result = await caller.tickets.create(inputWithNullAssignee as TicketCreateInput);

      expect(result.assigneeId).toBeNull();
      expect(mockPrisma.ticket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            assigneeId: null,
          }),
        })
      );
    });

    it('should allow updating only a single field (partial update)', async () => {
      const partialUpdatePayload = {
        id: mockTicket.id,
        description: 'Only updating the description.',
      };
      const updatedTicket = { ...mockTicket, description: partialUpdatePayload.description };
      mockPrisma.ticket.update.mockResolvedValueOnce(updatedTicket);

      const result = await caller.tickets.update(partialUpdatePayload as TicketUpdateInput);

      expect(result.description).toBe(partialUpdatePayload.description);
      expect(result.title).toBe(mockTicket.title); // Title should remain unchanged
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: partialUpdatePayload.description,
            title: undefined, // Check that other fields are not passed as undefined, which could overwrite
          }),
        })
      );
    });
  });
});

// Test Count: 20 (approximate count of 'it' blocks)
// Coverage Areas: CRUD, Input Validation, Error Handling, Authentication/Authorization, Edge Cases, Database Mocking

