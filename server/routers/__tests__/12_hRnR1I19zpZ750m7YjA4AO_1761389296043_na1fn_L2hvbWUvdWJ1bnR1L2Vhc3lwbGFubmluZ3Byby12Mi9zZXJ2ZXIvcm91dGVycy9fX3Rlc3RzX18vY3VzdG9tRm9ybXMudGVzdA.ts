import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory } from '@trpc/server';
import { appRouter, AppRouter } from '../../_app'; // Assuming appRouter is where all routers are merged
import { inferProcedureInput } from '@trpc/server';
import { TRPCError } from '@trpc/server';

// --- MOCK DEPENDENCIES ---

// 1. Mock the database client (Prisma is common in tRPC/T3 stack)
const mockPrisma = {
  customForm: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn((cb) => cb(mockPrisma)),
};

// 2. Mock the context creator (usually in `src/server/context.ts`)
// We'll create a mock context factory to control auth state.
const createMockContext = (userId: string | null = 'user-123') => ({
  session: userId ? { user: { id: userId } } : null,
  prisma: mockPrisma,
});

// --- SETUP CALLER ---

// Helper to create the caller for the customForms router
// We assume the customForms router is nested under 'customForms' in the root appRouter
const createCaller = createCallerFactory(appRouter);

// Type for the caller specific to the customForms router
type CustomFormsRouter = AppRouter['customForms'];
type CustomFormsCaller = ReturnType<typeof createCaller>['customForms'];

// --- TEST DATA ---

const mockForm = {
  id: 'form-1',
  name: 'Test Form',
  description: 'A form for testing',
  userId: 'user-123',
  fields: [{ id: 'field-1', type: 'text', label: 'Name' }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- TEST SUITE ---

describe('customFormsRouter', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- AUTHENTICATION & AUTHORIZATION TESTS (4) ---

  describe('Authentication Checks', () => {
    const unauthedCaller = createCaller(createMockContext(null)).customForms;

    it('should throw TRPCError if user is not authenticated for create procedure', async () => {
      const input: inferProcedureInput<CustomFormsRouter['create']> = {
        name: 'Unauthed Form',
        description: 'Should fail',
        fields: [],
      };
      await expect(unauthedCaller.create(input)).rejects.toThrow(TRPCError);
      await expect(unauthedCaller.create(input)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should throw TRPCError if user is not authenticated for update procedure', async () => {
      const input: inferProcedureInput<CustomFormsRouter['update']> = {
        id: 'form-to-update',
        name: 'New Name',
      };
      await expect(unauthedCaller.update(input)).rejects.toThrow(TRPCError);
      await expect(unauthedCaller.update(input)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });
  });

  // --- CRUD OPERATIONS & EDGE CASES & VALIDATION (21) ---

  describe('CRUD Operations', () => {
    const authedCaller = createCaller(createMockContext('user-123')).customForms;

    // --- CREATE (4) ---
    describe('create', () => {
      type Input = inferProcedureInput<CustomFormsRouter['create']>;

      it('should successfully create a new custom form', async () => {
        mockPrisma.customForm.create.mockResolvedValue(mockForm);
        const input: Input = {
          name: 'New Form',
          description: 'A new form',
          fields: [{ type: 'text', label: 'Email' }],
        };

        const result = await authedCaller.create(input);

        expect(result).toEqual(mockForm);
        expect(mockPrisma.customForm.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              name: 'New Form',
              userId: 'user-123',
            }),
          }),
        );
      });

      it('should handle missing optional description (validation)', async () => {
        mockPrisma.customForm.create.mockResolvedValue({ ...mockForm, description: null });
        const input: Input = {
          name: 'Form without description',
          fields: [],
        };

        const result = await authedCaller.create(input);
        expect(result.description).toBeNull();
      });

      it('should throw a validation error for a name that is too short', async () => {
        const input: Input = {
          name: 'A', // Assuming min length is 3
          fields: [],
        };
        // tRPC validation error is usually a TRPCError with code BAD_REQUEST
        await expect(authedCaller.create(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.create(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });

      it('should throw an error if database operation fails (error handling)', async () => {
        const dbError = new Error('Database connection failed');
        mockPrisma.customForm.create.mockRejectedValue(dbError);
        const input: Input = {
          name: 'Failing Form',
          fields: [],
        };

        await expect(authedCaller.create(input)).rejects.toThrow(dbError);
      });
    });

    // --- READ (6) ---
    describe('read', () => {
      type Input = inferProcedureInput<CustomFormsRouter['read']>;

      it('should successfully retrieve a custom form by ID', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm);
        const input: Input = { id: 'form-1' };

        const result = await authedCaller.read(input);

        expect(result).toEqual(mockForm);
        expect(mockPrisma.customForm.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: 'form-1' } }),
        );
      });

      it('should return null for a non-existent ID (edge case)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(null);
        const input: Input = { id: 'non-existent-id' };

        const result = await authedCaller.read(input);
        expect(result).toBeNull();
      });

      it('should throw a validation error for an invalid ID format', async () => {
        const input: Input = { id: 'invalid-id-format!' }; // Assuming ID is a CUID/UUID
        await expect(authedCaller.read(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.read(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });

      it('should throw a NOT_FOUND error if the form belongs to another user (authorization)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue({ ...mockForm, userId: 'other-user' });
        const input: Input = { id: 'form-1' };

        await expect(authedCaller.read(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.read(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });

      it('should handle database error during read (error handling)', async () => {
        const dbError = new Error('Read operation failed');
        mockPrisma.customForm.findUnique.mockRejectedValue(dbError);
        const input: Input = { id: 'form-1' };

        await expect(authedCaller.read(input)).rejects.toThrow(dbError);
      });

      it('should throw a validation error for an empty ID string (edge case/validation)', async () => {
        const input: Input = { id: '' };
        await expect(authedCaller.read(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.read(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });
    });

    // --- UPDATE (6) ---
    describe('update', () => {
      type Input = inferProcedureInput<CustomFormsRouter['update']>;

      it('should successfully update the form name', async () => {
        const updatedForm = { ...mockForm, name: 'Updated Name' };
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm); // Auth check
        mockPrisma.customForm.update.mockResolvedValue(updatedForm);
        const input: Input = { id: 'form-1', name: 'Updated Name' };

        const result = await authedCaller.update(input);

        expect(result).toEqual(updatedForm);
        expect(mockPrisma.customForm.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: 'form-1' },
            data: { name: 'Updated Name' },
          }),
        );
      });

      it('should throw NOT_FOUND error if form to update does not exist (edge case)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(null);
        const input: Input = { id: 'non-existent-id', name: 'New Name' };

        await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });

      it('should throw NOT_FOUND error if form belongs to another user (authorization)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue({ ...mockForm, userId: 'other-user' });
        const input: Input = { id: 'form-1', name: 'New Name' };

        await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });

      it('should throw a validation error if name update is too short', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm);
        const input: Input = { id: 'form-1', name: 'S' }; // Assuming min length is 3

        await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });

      it('should throw a validation error if no fields are provided for update', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm);
        const input: Input = { id: 'form-1' }; // No name, description, or fields

        // Assuming the update procedure requires at least one field to be present
        await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });

      it('should handle database error during update (error handling)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm);
        const dbError = new Error('Update operation failed');
        mockPrisma.customForm.update.mockRejectedValue(dbError);
        const input: Input = { id: 'form-1', name: 'Failing Update' };

        await expect(authedCaller.update(input)).rejects.toThrow(dbError);
      });
    });

    // --- DELETE (5) ---
    describe('delete', () => {
      type Input = inferProcedureInput<CustomFormsRouter['delete']>;

      it('should successfully delete a custom form', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm); // Auth check
        mockPrisma.customForm.delete.mockResolvedValue(mockForm);
        const input: Input = { id: 'form-1' };

        const result = await authedCaller.delete(input);

        expect(result).toEqual(mockForm);
        expect(mockPrisma.customForm.delete).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: 'form-1' } }),
        );
      });

      it('should throw NOT_FOUND error if form to delete does not exist (edge case)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(null);
        const input: Input = { id: 'non-existent-id' };

        await expect(authedCaller.delete(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.delete(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });

      it('should throw NOT_FOUND error if form belongs to another user (authorization)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue({ ...mockForm, userId: 'other-user' });
        const input: Input = { id: 'form-1' };

        await expect(authedCaller.delete(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.delete(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      });

      it('should throw a validation error for an invalid ID format', async () => {
        const input: Input = { id: 'invalid-id' };
        await expect(authedCaller.delete(input)).rejects.toThrow(TRPCError);
        await expect(authedCaller.delete(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      });

      it('should handle database error during delete (error handling)', async () => {
        mockPrisma.customForm.findUnique.mockResolvedValue(mockForm);
        const dbError = new Error('Delete operation failed');
        mockPrisma.customForm.delete.mockRejectedValue(dbError);
        const input: Input = { id: 'form-1' };

        await expect(authedCaller.delete(input)).rejects.toThrow(dbError);
      });
    });

    // --- LIST (2) ---
    describe('list', () => {
      it('should successfully retrieve a list of custom forms for the authenticated user', async () => {
        mockPrisma.customForm.findMany.mockResolvedValue([mockForm, { ...mockForm, id: 'form-2' }]);

        const result = await authedCaller.list();

        expect(result.length).toBe(2);
        expect(mockPrisma.customForm.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ where: { userId: 'user-123' } }),
        );
      });

      it('should return an empty array if no forms are found (edge case)', async () => {
        mockPrisma.customForm.findMany.mockResolvedValue([]);

        const result = await authedCaller.list();
        expect(result).toEqual([]);
      });
    });
  });
});

// Total tests: 2 + 4 + 6 + 6 + 5 + 2 = 25 tests
// Note: The actual number of tests will depend on the final structure of the router procedures.
// This mock assumes the existence of: create, read, update, delete, and list procedures.
// The test count is based on the `it` blocks.

