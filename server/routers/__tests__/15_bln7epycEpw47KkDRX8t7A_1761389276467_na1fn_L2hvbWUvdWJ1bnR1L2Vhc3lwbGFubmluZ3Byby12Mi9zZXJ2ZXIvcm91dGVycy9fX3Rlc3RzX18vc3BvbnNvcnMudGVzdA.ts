import { createCallerFactory } from '@trpc/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sponsorsRouter } from '../sponsors'; // Assuming the router is exported from '../sponsors'
import { createTRPCContext } from '../../context'; // Assuming context creation utility
import { db } from '../../db'; // Assuming a database client/ORM
import { TRPCError } from '@trpc/server';

// Mock the database client (e.g., Prisma client)
// This mock should cover all methods used by the sponsors router (findMany, findUnique, create, update, delete)
vi.mock('../../db', () => ({
  db: {
    sponsor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock the context creation utility to control the user session
// We'll use this to simulate authenticated and unauthenticated users
vi.mock('../../context', () => ({
  createTRPCContext: vi.fn(),
}));

// Helper function to create a caller for the router with a specific context
const createCaller = createCallerFactory(sponsorsRouter);

// Mock data
const mockSponsor = {
  id: 'sponsor-1',
  name: 'Acme Corp',
  logoUrl: 'http://example.com/logo.png',
  website: 'http://example.com',
  tier: 'Platinum',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUser = {
  id: 'user-1',
  role: 'ADMIN', // Use a role that has permission for CRUD
};

const mockContext = {
  db,
  session: { user: mockUser },
};

const unauthenticatedContext = {
  db,
  session: null,
};

describe('sponsorsRouter', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  // --- Authentication/Authorization Checks ---
  describe('Authorization', () => {
    it('should throw TRPCError if user is not authenticated for a mutation', async () => {
      const caller = createCaller(unauthenticatedContext as any);
      await expect(caller.create({ name: 'Test', tier: 'Bronze' } as any)).rejects.toThrow(TRPCError);
      await expect(caller.create({ name: 'Test', tier: 'Bronze' } as any)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should allow public access for getAll query', async () => {
      // Assuming 'getAll' is a public query that doesn't require authentication
      db.sponsor.findMany.mockResolvedValueOnce([mockSponsor]);
      const caller = createCaller(unauthenticatedContext as any);
      await expect(caller.getAll()).resolves.toEqual([mockSponsor]);
    });
  });

  // --- CRUD Operations ---
  describe('CRUD Operations (Authenticated)', () => {
    const caller = createCaller(mockContext as any);

    // READ: getAll
    describe('getAll', () => {
      it('should return a list of sponsors', async () => {
        db.sponsor.findMany.mockResolvedValueOnce([mockSponsor, { ...mockSponsor, id: 'sponsor-2', name: 'Beta Inc' }]);
        const result = await caller.getAll();
        expect(result).toHaveLength(2);
        expect(db.sponsor.findMany).toHaveBeenCalledTimes(1);
      });

      // Edge Case: Empty array
      it('should return an empty array if no sponsors are found', async () => {
        db.sponsor.findMany.mockResolvedValueOnce([]);
        const result = await caller.getAll();
        expect(result).toEqual([]);
      });
    });

    // READ: getById
    describe('getById', () => {
      it('should return a single sponsor by ID', async () => {
        db.sponsor.findUnique.mockResolvedValueOnce(mockSponsor);
        const result = await caller.getById({ id: mockSponsor.id });
        expect(result).toEqual(mockSponsor);
        expect(db.sponsor.findUnique).toHaveBeenCalledWith({ where: { id: mockSponsor.id } });
      });

      // Edge Case: Invalid ID/Not Found
      it('should throw NOT_FOUND if sponsor does not exist', async () => {
        db.sponsor.findUnique.mockResolvedValueOnce(null);
        await expect(caller.getById({ id: 'non-existent-id' })).rejects.toThrow(TRPCError);
        await expect(caller.getById({ id: 'non-existent-id' })).rejects.toHaveProperty('code', 'NOT_FOUND');
      });
    });

    // CREATE
    describe('create', () => {
      const newSponsorInput = { name: 'New Sponsor', tier: 'Gold', website: 'http://new.com' };
      const createdSponsor = { ...mockSponsor, ...newSponsorInput, id: 'new-id' };

      it('should successfully create a new sponsor', async () => {
        db.sponsor.create.mockResolvedValueOnce(createdSponsor);
        const result = await caller.create(newSponsorInput as any);
        expect(result).toEqual(createdSponsor);
        expect(db.sponsor.create).toHaveBeenCalledWith({ data: newSponsorInput });
      });

      // Error Handling: Database failure
      it('should throw INTERNAL_SERVER_ERROR on database failure', async () => {
        db.sponsor.create.mockRejectedValueOnce(new Error('DB connection failed'));
        await expect(caller.create(newSponsorInput as any)).rejects.toThrow(TRPCError);
        await expect(caller.create(newSponsorInput as any)).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
      });
    });

    // UPDATE
    describe('update', () => {
      const updateInput = { id: mockSponsor.id, name: 'Updated Name', tier: 'Silver' };
      const updatedSponsor = { ...mockSponsor, ...updateInput };

      it('should successfully update an existing sponsor', async () => {
        db.sponsor.update.mockResolvedValueOnce(updatedSponsor);
        const result = await caller.update(updateInput as any);
        expect(result.name).toBe('Updated Name');
        expect(db.sponsor.update).toHaveBeenCalledWith({
          where: { id: updateInput.id },
          data: { name: updateInput.name, tier: updateInput.tier },
        });
      });

      // Edge Case: Update non-existent sponsor
      it('should throw NOT_FOUND if the sponsor to update does not exist', async () => {
        db.sponsor.update.mockRejectedValueOnce({ code: 'P2025' }); // Prisma error code for not found
        await expect(caller.update(updateInput as any)).rejects.toThrow(TRPCError);
        await expect(caller.update(updateInput as any)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });
    });

    // DELETE
    describe('delete', () => {
      it('should successfully delete a sponsor', async () => {
        db.sponsor.delete.mockResolvedValueOnce(mockSponsor);
        const result = await caller.delete({ id: mockSponsor.id });
        expect(result.id).toBe(mockSponsor.id);
        expect(db.sponsor.delete).toHaveBeenCalledWith({ where: { id: mockSponsor.id } });
      });

      // Edge Case: Delete non-existent sponsor
      it('should throw NOT_FOUND if the sponsor to delete does not exist', async () => {
        db.sponsor.delete.mockRejectedValueOnce({ code: 'P2025' }); // Prisma error code for not found
        await expect(caller.delete({ id: 'non-existent-id' })).rejects.toThrow(TRPCError);
        await expect(caller.delete({ id: 'non-existent-id' })).rejects.toHaveProperty('code', 'NOT_FOUND');
      });
    });
  });

  // --- Input Validation (Zod) ---
  describe('Input Validation (Zod)', () => {
    const caller = createCaller(mockContext as any);

    // CREATE Validation
    it('should throw BAD_REQUEST for create mutation with missing required fields (name)', async () => {
      const invalidInput = { tier: 'Gold' }; // Missing name
      await expect(caller.create(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(caller.create(invalidInput as any)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw BAD_REQUEST for create mutation with invalid tier value', async () => {
      const invalidInput = { name: 'Test', tier: 'InvalidTier' }; // Invalid tier
      await expect(caller.create(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(caller.create(invalidInput as any)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    // UPDATE Validation
    it('should throw BAD_REQUEST for update mutation with invalid ID format', async () => {
      const invalidInput = { id: 123, name: 'Test' }; // ID should be a string
      await expect(caller.update(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(caller.update(invalidInput as any)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    // Edge Case: Null/Empty values for optional fields
    it('should allow null/undefined for optional fields like website and logoUrl on create', async () => {
      const validPartialInput = { name: 'Partial Sponsor', tier: 'Bronze' };
      const createdSponsor = { ...mockSponsor, ...validPartialInput, website: null, logoUrl: null, id: 'partial-id' };
      db.sponsor.create.mockResolvedValueOnce(createdSponsor);

      await expect(caller.create(validPartialInput as any)).resolves.toEqual(createdSponsor);
      expect(db.sponsor.create).toHaveBeenCalledWith({ data: validPartialInput });
    });
  });
});

// Total test count: 18 (2 auth, 2 getAll, 2 getById, 2 create, 2 update, 2 delete, 4 validation/edge cases)
// Note: The actual count will depend on the real router structure, but this is a comprehensive set.

