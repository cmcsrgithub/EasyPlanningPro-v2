import { describe, it, expect, vi, beforeEach } from 'vitest';
import { templatesRouter } from '../templates';
import { type inferProcedureInput, TRPCError } from '@trpc/server';
import { db } from '../db';

// --- Mocks ---

// Mock the database module
vi.mock('../db', () => ({
  db: {
    template: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Type for the mocked database
const mockDb = db as unknown as {
  template: {
    create: vi.Mock;
    findUnique: vi.Mock;
    findMany: vi.Mock;
    update: vi.Mock;
    delete: vi.Mock;
  };
};

// Mock Context
const USER_ID = 'user-456';
const mockUser = { id: USER_ID };
const mockContext = (user: typeof mockUser | null) => ({
  user,
});

// Utility function to call a procedure directly
const callProcedure = async <T extends keyof typeof templatesRouter._def.procedures>(
  procedureName: T,
  input: inferProcedureInput<typeof templatesRouter._def.procedures[T]>,
  ctx: ReturnType<typeof mockContext>
) => {
  const procedure = templatesRouter._def.procedures[procedureName];
  return procedure.call({
    ctx,
    input,
    type: procedureName.startsWith('get') || procedureName.startsWith('getAll') ? 'query' : 'mutation',
    path: procedureName,
  });
};

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// --- Test Suite ---

describe('templatesRouter', () => {
  const TEMPLATE_ID = 'template-123';
  const ANOTHER_USER_ID = 'user-789';
  const MOCK_TEMPLATE = { id: TEMPLATE_ID, title: 'Test Template', content: 'Content', userId: USER_ID };
  const AUTH_CTX = mockContext(mockUser);
  const UN_AUTH_CTX = mockContext(null);

  // --- CRUD Operations & Authentication ---

  describe('create', () => {
    const input = { title: 'New Template', content: 'New Content' };
    const mockCreateResult = { ...input, id: TEMPLATE_ID, userId: USER_ID, createdAt: new Date(), updatedAt: new Date() };

    it('should successfully create a new template for an authenticated user', async () => {
      mockDb.template.create.mockResolvedValue(mockCreateResult);

      const result = await callProcedure('create', input, AUTH_CTX);

      expect(result).toEqual(mockCreateResult);
      expect(mockDb.template.create).toHaveBeenCalledWith({
        data: {
          ...input,
          userId: USER_ID,
        },
      });
    });

    it('should throw UNAUTHORIZED error if user is not authenticated', async () => {
      await expect(callProcedure('create', input, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('create', input, UN_AUTH_CTX)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
      expect(mockDb.template.create).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    const input = { id: TEMPLATE_ID };

    it('should successfully retrieve a template for a public user', async () => {
      mockDb.template.findUnique.mockResolvedValue(MOCK_TEMPLATE);

      const result = await callProcedure('get', input, UN_AUTH_CTX); // Public procedure

      expect(result).toEqual(MOCK_TEMPLATE);
      expect(mockDb.template.findUnique).toHaveBeenCalledWith({ where: { id: TEMPLATE_ID } });
    });

    it('should throw NOT_FOUND error if template does not exist (Edge Case)', async () => {
      mockDb.template.findUnique.mockResolvedValue(null);

      await expect(callProcedure('get', input, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('get', input, UN_AUTH_CTX)).rejects.toHaveProperty('message', 'Template not found');
    });
  });

  describe('getAll', () => {
    const mockTemplates = [MOCK_TEMPLATE, { ...MOCK_TEMPLATE, id: 'template-2' }];

    it('should successfully retrieve all templates for an authenticated user', async () => {
      mockDb.template.findMany.mockResolvedValue(mockTemplates);

      const result = await callProcedure('getAll', undefined, AUTH_CTX);

      expect(result).toEqual(mockTemplates);
      expect(mockDb.template.findMany).toHaveBeenCalledWith({ where: { userId: USER_ID } });
    });

    it('should throw UNAUTHORIZED error if user is not authenticated', async () => {
      await expect(callProcedure('getAll', undefined, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('getAll', undefined, UN_AUTH_CTX)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
      expect(mockDb.template.findMany).not.toHaveBeenCalled();
    });

    it('should return an empty array if no templates are found (Edge Case)', async () => {
      mockDb.template.findMany.mockResolvedValue([]);

      const result = await callProcedure('getAll', undefined, AUTH_CTX);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const input = { id: TEMPLATE_ID, title: 'Updated Title' };
    const mockUpdateResult = { ...MOCK_TEMPLATE, title: 'Updated Title' };

    it('should successfully update a template for the owner', async () => {
      mockDb.template.findUnique.mockResolvedValue(MOCK_TEMPLATE); // Check ownership
      mockDb.template.update.mockResolvedValue(mockUpdateResult);

      const result = await callProcedure('update', input, AUTH_CTX);

      expect(result).toEqual(mockUpdateResult);
      expect(mockDb.template.update).toHaveBeenCalledWith({
        where: { id: TEMPLATE_ID },
        data: { title: 'Updated Title' },
      });
    });

    it('should throw UNAUTHORIZED error if user is not authenticated', async () => {
      await expect(callProcedure('update', input, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      expect(mockDb.template.update).not.toHaveBeenCalled();
    });

    it('should throw an error if template does not exist (Edge Case)', async () => {
      mockDb.template.findUnique.mockResolvedValue(null);

      await expect(callProcedure('update', input, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('update', input, AUTH_CTX)).rejects.toHaveProperty('message', 'Template not found or unauthorized');
      expect(mockDb.template.update).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the owner (Authorization Check)', async () => {
      const templateFromAnotherUser = { ...MOCK_TEMPLATE, userId: ANOTHER_USER_ID };
      mockDb.template.findUnique.mockResolvedValue(templateFromAnotherUser);

      await expect(callProcedure('update', input, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('update', input, AUTH_CTX)).rejects.toHaveProperty('message', 'Template not found or unauthorized');
      expect(mockDb.template.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const input = { id: TEMPLATE_ID };
    const mockDeleteResult = { id: TEMPLATE_ID, title: 'Deleted Template' };

    it('should successfully delete a template for the owner', async () => {
      mockDb.template.findUnique.mockResolvedValue(MOCK_TEMPLATE); // Check ownership
      mockDb.template.delete.mockResolvedValue(mockDeleteResult);

      const result = await callProcedure('delete', input, AUTH_CTX);

      expect(result).toEqual(mockDeleteResult);
      expect(mockDb.template.delete).toHaveBeenCalledWith({ where: { id: TEMPLATE_ID } });
    });

    it('should throw UNAUTHORIZED error if user is not authenticated', async () => {
      await expect(callProcedure('delete', input, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      expect(mockDb.template.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if template does not exist', async () => {
      mockDb.template.findUnique.mockResolvedValue(null);

      await expect(callProcedure('delete', input, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('delete', input, AUTH_CTX)).rejects.toHaveProperty('message', 'Template not found or unauthorized');
      expect(mockDb.template.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the owner (Authorization Check)', async () => {
      const templateFromAnotherUser = { ...MOCK_TEMPLATE, userId: ANOTHER_USER_ID };
      mockDb.template.findUnique.mockResolvedValue(templateFromAnotherUser);

      await expect(callProcedure('delete', input, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('delete', input, AUTH_CTX)).rejects.toHaveProperty('message', 'Template not found or unauthorized');
      expect(mockDb.template.delete).not.toHaveBeenCalled();
    });
  });

  // --- Input Validation (Zod Schemas) ---

  describe('Input Validation', () => {
    it('create should fail with a Zod error if title is missing', async () => {
      const invalidInput = { content: 'Content only' };
      await expect(callProcedure('create', invalidInput as any, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('create', invalidInput as any, AUTH_CTX)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(mockDb.template.create).not.toHaveBeenCalled();
    });

    it('create should fail with a Zod error if title is an empty string (Edge Case)', async () => {
      const invalidInput = { title: '', content: 'Content' };
      await expect(callProcedure('create', invalidInput as any, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('create', invalidInput as any, AUTH_CTX)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('update should fail with a Zod error if title is an empty string', async () => {
      const invalidInput = { id: TEMPLATE_ID, title: '' };
      await expect(callProcedure('update', invalidInput as any, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('update', invalidInput as any, AUTH_CTX)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('get/delete should fail with a Zod error if id is missing', async () => {
      const invalidInput = {};
      await expect(callProcedure('get', invalidInput as any, UN_AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('get', invalidInput as any, UN_AUTH_CTX)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      await expect(callProcedure('delete', invalidInput as any, AUTH_CTX)).rejects.toThrow(TRPCError);
      await expect(callProcedure('delete', invalidInput as any, AUTH_CTX)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });
  });

  // --- Error Handling (Database Errors) ---

  describe('Database Error Handling', () => {
    const input = { title: 'New Template', content: 'New Content' };
    const dbError = new Error('Database connection failed');

    it('should handle database errors during create (try/catch)', async () => {
      mockDb.template.create.mockRejectedValue(dbError);

      // The router does not explicitly catch and re-throw, so the TRPCError should wrap the underlying error.
      // We expect the test to fail with the underlying error or a TRPCError if the tRPC layer handles it.
      // Since the mock router does not have explicit try/catch, we expect the error to propagate.
      await expect(callProcedure('create', input, AUTH_CTX)).rejects.toThrow(dbError);
    });

    it('should handle database errors during update (try/catch)', async () => {
      mockDb.template.findUnique.mockResolvedValue(MOCK_TEMPLATE);
      mockDb.template.update.mockRejectedValue(dbError);

      const updateInput = { id: TEMPLATE_ID, title: 'New Title' };
      await expect(callProcedure('update', updateInput, AUTH_CTX)).rejects.toThrow(dbError);
    });
  });
});

