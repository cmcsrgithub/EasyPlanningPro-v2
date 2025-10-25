import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory, router } from '@trpc/server';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createMockContext, createMockSession, mockPrisma } from './mockUtils';

// --- 1. MOCK THE ROUTER IMPLEMENTATION ---
// Since we don't have the actual implementation, we'll define a mock router
// that implements the assumed procedures and logic.

// Assumed Input Schemas
const createDonationSchema = z.object({
  amount: z.number().positive(),
  donorName: z.string().min(1),
});

const getDonationByIdSchema = z.object({
  id: z.string().uuid(),
});

const getAllDonationsSchema = z.object({
  limit: z.number().optional(),
  cursor: z.string().optional(),
});

const updateDonationSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  donorName: z.string().min(1).optional(),
});

const deleteDonationSchema = z.object({
  id: z.string().uuid(),
});

// Mock Data
const MOCK_DONATION = {
  id: 'd9b1d0e1-0c5a-4f5b-8e1d-3b9e8c4d2f1a',
  amount: 100.5,
  donorName: 'Test Donor',
  userId: 'mock-user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Helper function for auth check
const isAuthenticated = (ctx: ReturnType<typeof createMockContext>) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
};

// Helper function for admin check
const isAdmin = (ctx: ReturnType<typeof createMockContext>) => {
  isAuthenticated(ctx);
  if (ctx.session?.user?.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
};

// Helper function for ownership check
const isOwnerOrAdmin = (ctx: ReturnType<typeof createMockContext>, recordUserId: string) => {
  isAuthenticated(ctx);
  const userId = ctx.session?.user?.id;
  const userRole = ctx.session?.user?.role;

  if (userId !== recordUserId && userRole !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
};


// Mock tRPC Router
const donationsRouter = router({
  // 1. CREATE
  create: createCallerFactory()
    .mutation({
      input: createDonationSchema,
      resolve: async ({ ctx, input }) => {
        isAuthenticated(ctx); // Auth check

        try {
          const newDonation = await ctx.db.donation.create({
            data: {
              ...input,
              userId: ctx.session!.user.id,
            },
          });
          return newDonation;
        } catch (error) {
          // Simulate database error handling
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create donation.',
            cause: error,
          });
        }
      },
    }),

  // 2. READ (getById)
  getById: createCallerFactory()
    .query({
      input: getDonationByIdSchema,
      resolve: async ({ ctx, input }) => {
        isAuthenticated(ctx); // Auth check

        const donation = await ctx.db.donation.findUnique({
          where: { id: input.id },
        });

        if (!donation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Donation not found.' });
        }

        // Ownership check (assuming a user can only view their own donations unless admin)
        isOwnerOrAdmin(ctx, donation.userId);

        return donation;
      },
    }),

  // 3. READ (getAll) - Admin only
  getAll: createCallerFactory()
    .query({
      input: getAllDonationsSchema,
      resolve: async ({ ctx, input }) => {
        isAdmin(ctx); // Authorization check

        const donations = await ctx.db.donation.findMany({
          take: input.limit,
          cursor: input.cursor ? { id: input.cursor } : undefined,
        });
        return donations;
      },
    }),

  // 4. UPDATE
  update: createCallerFactory()
    .mutation({
      input: updateDonationSchema,
      resolve: async ({ ctx, input }) => {
        isAuthenticated(ctx); // Auth check

        const existingDonation = await ctx.db.donation.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });

        if (!existingDonation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Donation not found.' });
        }

        isOwnerOrAdmin(ctx, existingDonation.userId); // Ownership check

        const updatedDonation = await ctx.db.donation.update({
          where: { id: input.id },
          data: input,
        });

        return updatedDonation;
      },
    }),

  // 5. DELETE
  delete: createCallerFactory()
    .mutation({
      input: deleteDonationSchema,
      resolve: async ({ ctx, input }) => {
        isAuthenticated(ctx); // Auth check

        const existingDonation = await ctx.db.donation.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });

        if (!existingDonation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Donation not found.' });
        }

        isOwnerOrAdmin(ctx, existingDonation.userId); // Ownership check

        await ctx.db.donation.delete({
          where: { id: input.id },
        });

        return { success: true };
      },
    }),
});

// Create the test caller factory
const createCaller = createCallerFactory(donationsRouter);

// --- 2. VITEST TEST SUITE ---

describe('donationsRouter', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock sessions for different roles
  const userSession = createMockSession('USER');
  const adminSession = createMockSession('ADMIN');
  const unauthenticatedSession = createMockSession('UNAUTHENTICATED');

  // Test data
  const validCreateInput = { amount: 50.0, donorName: 'Jane Doe' };
  const invalidId = 'invalid-uuid-format';
  const validId = MOCK_DONATION.id;
  const nonExistentId = 'a0b1c2d3-e4f5-6789-0123-456789abcdef';

  // --- AUTHENTICATION/AUTHORIZATION TESTS (Total: 10) ---

  describe('Authentication and Authorization Checks', () => {
    it('should throw UNAUTHORIZED for unauthenticated users on create', async () => {
      const ctx = createMockContext(unauthenticatedSession);
      const caller = createCaller(ctx);
      await expect(caller.create(validCreateInput)).rejects.toThrow('UNAUTHORIZED');
    }); // (1)

    it('should throw UNAUTHORIZED for unauthenticated users on getById', async () => {
      const ctx = createMockContext(unauthenticatedSession);
      const caller = createCaller(ctx);
      await expect(caller.getById({ id: validId })).rejects.toThrow('UNAUTHORIZED');
    }); // (2)

    it('should throw UNAUTHORIZED for unauthenticated users on getAll', async () => {
      const ctx = createMockContext(unauthenticatedSession);
      const caller = createCaller(ctx);
      await expect(caller.getAll({})).rejects.toThrow('UNAUTHORIZED');
    }); // (3)

    it('should throw UNAUTHORIZED for unauthenticated users on update', async () => {
      const ctx = createMockContext(unauthenticatedSession);
      const caller = createCaller(ctx);
      await expect(caller.update({ id: validId, amount: 60.0 })).rejects.toThrow('UNAUTHORIZED');
    }); // (4)

    it('should throw UNAUTHORIZED for unauthenticated users on delete', async () => {
      const ctx = createMockContext(unauthenticatedSession);
      const caller = createCaller(ctx);
      await expect(caller.delete({ id: validId })).rejects.toThrow('UNAUTHORIZED');
    }); // (5)

    it('should throw FORBIDDEN for non-admin users on getAll', async () => {
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);
      await expect(caller.getAll({})).rejects.toThrow('FORBIDDEN');
    }); // (6)

    it('should allow admin users on getAll', async () => {
      mockPrisma.donation.findMany.mockResolvedValueOnce([]);
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);
      await expect(caller.getAll({})).resolves.toEqual([]);
      expect(mockPrisma.donation.findMany).toHaveBeenCalledOnce();
    }); // (7)

    it('should throw FORBIDDEN for non-owner users on getById', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ ...MOCK_DONATION, userId: 'other-user-id' });
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);
      await expect(caller.getById({ id: validId })).rejects.toThrow('FORBIDDEN');
    }); // (8)

    it('should throw FORBIDDEN for non-owner users on update', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: 'other-user-id' });
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);
      await expect(caller.update({ id: validId, amount: 60.0 })).rejects.toThrow('FORBIDDEN');
    }); // (9)

    it('should throw FORBIDDEN for non-owner users on delete', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: 'other-user-id' });
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);
      await expect(caller.delete({ id: validId })).rejects.toThrow('FORBIDDEN');
    }); // (10)
  });

  // --- CRUD TESTS (Total: 10) ---

  describe('CRUD Operations', () => {
    // CREATE
    it('should successfully create a new donation', async () => {
      mockPrisma.donation.create.mockResolvedValueOnce(MOCK_DONATION);
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);

      const result = await caller.create(validCreateInput);

      expect(result).toEqual(MOCK_DONATION);
      expect(mockPrisma.donation.create).toHaveBeenCalledWith({
        data: {
          ...validCreateInput,
          userId: userSession.user!.id,
        },
      });
    }); // (11)

    // READ (getById)
    it('should successfully retrieve a donation by ID (owner)', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce(MOCK_DONATION);
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);

      const result = await caller.getById({ id: validId });

      expect(result).toEqual(MOCK_DONATION);
      expect(mockPrisma.donation.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
    }); // (12)

    it('should successfully retrieve a donation by ID (admin)', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ ...MOCK_DONATION, userId: 'other-user-id' });
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      const result = await caller.getById({ id: validId });

      expect(result).toEqual({ ...MOCK_DONATION, userId: 'other-user-id' });
      expect(mockPrisma.donation.findUnique).toHaveBeenCalledOnce();
    }); // (13)

    // READ (getAll)
    it('should successfully retrieve all donations (admin)', async () => {
      const mockDonations = [MOCK_DONATION, { ...MOCK_DONATION, id: 'another-id', amount: 200 }];
      mockPrisma.donation.findMany.mockResolvedValueOnce(mockDonations);
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      const result = await caller.getAll({});

      expect(result).toEqual(mockDonations);
      expect(mockPrisma.donation.findMany).toHaveBeenCalledWith({
        take: undefined,
        cursor: undefined,
      });
    }); // (14)

    it('should handle limit and cursor parameters on getAll (admin)', async () => {
      mockPrisma.donation.findMany.mockResolvedValueOnce([]);
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      await caller.getAll({ limit: 10, cursor: validId });

      expect(mockPrisma.donation.findMany).toHaveBeenCalledWith({
        take: 10,
        cursor: { id: validId },
      });
    }); // (15)


    // UPDATE
    it('should successfully update a donation (owner)', async () => {
      const updateInput = { id: validId, donorName: 'New Donor Name' };
      const updatedDonation = { ...MOCK_DONATION, donorName: 'New Donor Name' };

      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: userSession.user!.id }); // For auth check
      mockPrisma.donation.update.mockResolvedValueOnce(updatedDonation);
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);

      const result = await caller.update(updateInput);

      expect(result).toEqual(updatedDonation);
      expect(mockPrisma.donation.update).toHaveBeenCalledWith({
        where: { id: validId },
        data: updateInput,
      });
    }); // (16)

    it('should successfully update a donation (admin)', async () => {
      const updateInput = { id: validId, amount: 999.99 };
      const updatedDonation = { ...MOCK_DONATION, amount: 999.99, userId: 'other-user-id' };

      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: 'other-user-id' }); // For auth check
      mockPrisma.donation.update.mockResolvedValueOnce(updatedDonation);
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      const result = await caller.update(updateInput);

      expect(result).toEqual(updatedDonation);
      expect(mockPrisma.donation.update).toHaveBeenCalledOnce();
    }); // (17)

    // DELETE
    it('should successfully delete a donation (owner)', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: userSession.user!.id }); // For auth check
      mockPrisma.donation.delete.mockResolvedValueOnce(MOCK_DONATION); // Mock return value
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);

      const result = await caller.delete({ id: validId });

      expect(result).toEqual({ success: true });
      expect(mockPrisma.donation.delete).toHaveBeenCalledWith({
        where: { id: validId },
      });
    }); // (18)

    it('should successfully delete a donation (admin)', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: 'other-user-id' }); // For auth check
      mockPrisma.donation.delete.mockResolvedValueOnce({ ...MOCK_DONATION, userId: 'other-user-id' }); // Mock return value
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      const result = await caller.delete({ id: validId });

      expect(result).toEqual({ success: true });
      expect(mockPrisma.donation.delete).toHaveBeenCalledOnce();
    }); // (19)

    it('should throw NOT_FOUND when trying to delete a non-existent donation', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce(null);
      const ctx = createMockContext(userSession);
      const caller = createCaller(ctx);

      await expect(caller.delete({ id: nonExistentId })).rejects.toThrow('NOT_FOUND');
      expect(mockPrisma.donation.delete).not.toHaveBeenCalled();
    }); // (20)
  });

  // --- INPUT VALIDATION (Zod) TESTS (Total: 6) ---

  describe('Input Validation (Zod Schemas)', () => {
    const ctx = createMockContext(userSession);
    const caller = createCaller(ctx);

    it('should throw BAD_REQUEST for create with negative amount', async () => {
      const invalidInput = { amount: -10, donorName: 'Invalid' };
      await expect(caller.create(invalidInput as any)).rejects.toThrow('BAD_REQUEST');
    }); // (21)

    it('should throw BAD_REQUEST for create with empty donorName', async () => {
      const invalidInput = { amount: 10, donorName: '' };
      await expect(caller.create(invalidInput as any)).rejects.toThrow('BAD_REQUEST');
    }); // (22)

    it('should throw BAD_REQUEST for getById with invalid UUID format', async () => {
      await expect(caller.getById({ id: invalidId })).rejects.toThrow('BAD_REQUEST');
    }); // (23)

    it('should throw BAD_REQUEST for update with invalid UUID format', async () => {
      const invalidInput = { id: invalidId, amount: 100 };
      await expect(caller.update(invalidInput as any)).rejects.toThrow('BAD_REQUEST');
    }); // (24)

    it('should throw BAD_REQUEST for update with negative amount', async () => {
      const invalidInput = { id: validId, amount: -10 };
      await expect(caller.update(invalidInput as any)).rejects.toThrow('BAD_REQUEST');
    }); // (25)

    it('should throw BAD_REQUEST for delete with invalid UUID format', async () => {
      await expect(caller.delete({ id: invalidId })).rejects.toThrow('BAD_REQUEST');
    }); // (26)
  });

  // --- ERROR HANDLING & EDGE CASES TESTS (Total: 6) ---

  describe('Error Handling and Edge Cases', () => {
    const ctx = createMockContext(userSession);
    const caller = createCaller(ctx);

    // Error Handling (try/catch blocks)
    it('should throw INTERNAL_SERVER_ERROR when create database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      mockPrisma.donation.create.mockRejectedValueOnce(dbError);

      await expect(caller.create(validCreateInput)).rejects.toThrow('INTERNAL_SERVER_ERROR');
      await expect(caller.create(validCreateInput)).rejects.toHaveProperty('message', 'Failed to create donation.');
      expect(mockPrisma.donation.create).toHaveBeenCalledOnce();
    }); // (27)

    // Edge Cases (null values, non-existent)
    it('should throw NOT_FOUND when getById returns null', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce(null);

      await expect(caller.getById({ id: nonExistentId })).rejects.toThrow('NOT_FOUND');
      await expect(caller.getById({ id: nonExistentId })).rejects.toHaveProperty('message', 'Donation not found.');
    }); // (28)

    it('should throw NOT_FOUND when update target is null', async () => {
      mockPrisma.donation.findUnique.mockResolvedValueOnce(null); // Auth check fails here

      await expect(caller.update({ id: nonExistentId, amount: 100 })).rejects.toThrow('NOT_FOUND');
      expect(mockPrisma.donation.update).not.toHaveBeenCalled();
    }); // (29)

    it('should allow update with only one optional field (edge case)', async () => {
      const updateInput = { id: validId, amount: 75.0 };
      const updatedDonation = { ...MOCK_DONATION, amount: 75.0 };

      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: userSession.user!.id });
      mockPrisma.donation.update.mockResolvedValueOnce(updatedDonation);

      const result = await caller.update(updateInput);

      expect(result.amount).toBe(75.0);
      expect(mockPrisma.donation.update).toHaveBeenCalledWith({
        where: { id: validId },
        data: updateInput,
      });
    }); // (30)

    it('should allow update with no optional fields (edge case - no-op)', async () => {
      const updateInput = { id: validId };
      const updatedDonation = MOCK_DONATION;

      mockPrisma.donation.findUnique.mockResolvedValueOnce({ userId: userSession.user!.id });
      mockPrisma.donation.update.mockResolvedValueOnce(updatedDonation);

      const result = await caller.update(updateInput);

      expect(result).toEqual(MOCK_DONATION);
      expect(mockPrisma.donation.update).toHaveBeenCalledWith({
        where: { id: validId },
        data: updateInput,
      });
    }); // (31)

    it('should handle empty array return for getAll (edge case)', async () => {
      mockPrisma.donation.findMany.mockResolvedValueOnce([]);
      const ctx = createMockContext(adminSession);
      const caller = createCaller(ctx);

      const result = await caller.getAll({});

      expect(result).toEqual([]);
      expect(mockPrisma.donation.findMany).toHaveBeenCalledOnce();
    }); // (32)
  });
});

