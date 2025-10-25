import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportsRouter } from '../reports';
import { TRPCError } from '@trpc/server';
import { Context } from '../../trpc';
import { z } from 'zod';

// Mock data
const MOCK_USER_ID = 'user-123-uuid';
const MOCK_OTHER_USER_ID = 'user-456-uuid';
const MOCK_REPORT_ID = 'report-789-uuid';
const MOCK_REPORT = {
  id: MOCK_REPORT_ID,
  title: 'Test Report',
  content: 'This is the content of the test report.',
  userId: MOCK_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock the database client
const mockDb = {
  report: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// Helper to create a mock context
const createMockContext = (userId: string | null): Context => ({
  userId,
  db: mockDb as any,
});

describe('reportsRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Authentication/Authorization Tests (Auth) ---
  describe('Authentication and Authorization', () => {
    const unauthedCtx = createMockContext(null);

    it('should throw UNAUTHORIZED for create if not logged in', async () => {
      await expect(
        reportsRouter.create({
          ctx: unauthedCtx,
          input: { title: 'Test', content: 'Content' },
          type: 'mutation',
        })
      ).rejects.toThrow(TRPCError);
      await expect(
        reportsRouter.create({
          ctx: unauthedCtx,
          input: { title: 'Test', content: 'Content' },
          type: 'mutation',
        })
      ).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should throw UNAUTHORIZED for get if not logged in', async () => {
      await expect(
        reportsRouter.get({
          ctx: unauthedCtx,
          input: { id: MOCK_REPORT_ID },
          type: 'query',
        })
      ).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should throw FORBIDDEN for get if report belongs to another user', async () => {
      mockDb.report.findUnique.mockResolvedValue({
        ...MOCK_REPORT,
        userId: MOCK_OTHER_USER_ID,
      });
      const authedCtx = createMockContext(MOCK_USER_ID);

      await expect(
        reportsRouter.get({
          ctx: authedCtx,
          input: { id: MOCK_REPORT_ID },
          type: 'query',
        })
      ).rejects.toHaveProperty('code', 'FORBIDDEN');
    });
  });

  // --- CRUD Operations Tests (CRUD) & Database Mocking (Mocking) ---
  describe('CRUD Operations', () => {
    const authedCtx = createMockContext(MOCK_USER_ID);

    // CREATE
    describe('create', () => {
      it('should successfully create a new report', async () => {
        const input = { title: 'New Report', content: 'New Content' };
        const newReport = { ...MOCK_REPORT, ...input, id: 'new-id' };
        mockDb.report.create.mockResolvedValue(newReport);

        const result = await reportsRouter.create({
          ctx: authedCtx,
          input,
          type: 'mutation',
        });

        expect(mockDb.report.create).toHaveBeenCalledWith({
          data: {
            ...input,
            userId: MOCK_USER_ID,
          },
        });
        expect(result).toEqual(newReport);
      });

      // Error Handling
      it('should throw INTERNAL_SERVER_ERROR on database failure', async () => {
        mockDb.report.create.mockRejectedValue(new Error('DB error'));

        await expect(
          reportsRouter.create({
            ctx: authedCtx,
            input: { title: 'Fail', content: 'Me' },
            type: 'mutation',
          })
        ).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
      });
    });

    // READ (get)
    describe('get', () => {
      it('should successfully retrieve a report', async () => {
        mockDb.report.findUnique.mockResolvedValue(MOCK_REPORT);

        const result = await reportsRouter.get({
          ctx: authedCtx,
          input: { id: MOCK_REPORT_ID },
          type: 'query',
        });

        expect(mockDb.report.findUnique).toHaveBeenCalledWith({
          where: { id: MOCK_REPORT_ID },
        });
        expect(result).toEqual(MOCK_REPORT);
      });

      // Edge Case: Report not found
      it('should throw NOT_FOUND if report does not exist', async () => {
        mockDb.report.findUnique.mockResolvedValue(null);

        await expect(
          reportsRouter.get({
            ctx: authedCtx,
            input: { id: 'non-existent-id' },
            type: 'query',
          })
        ).rejects.toHaveProperty('code', 'NOT_FOUND');
      });
    });

    // READ (getAll)
    describe('getAll', () => {
      it('should return all reports for the authenticated user', async () => {
        const userReports = [MOCK_REPORT, { ...MOCK_REPORT, id: 'id-2' }];
        mockDb.report.findMany.mockResolvedValue(userReports);

        const result = await reportsRouter.getAll({
          ctx: authedCtx,
          input: undefined,
          type: 'query',
        });

        expect(mockDb.report.findMany).toHaveBeenCalledWith({
          where: { userId: MOCK_USER_ID },
          orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual(userReports);
      });

      // Edge Case: Empty array
      it('should return an empty array if no reports are found', async () => {
        mockDb.report.findMany.mockResolvedValue([]);

        const result = await reportsRouter.getAll({
          ctx: authedCtx,
          input: undefined,
          type: 'query',
        });

        expect(result).toEqual([]);
      });
    });

    // UPDATE
    describe('update', () => {
      it('should successfully update a report', async () => {
        const updateInput = {
          id: MOCK_REPORT_ID,
          title: 'Updated Title',
        };
        const updatedReport = { ...MOCK_REPORT, title: updateInput.title };

        mockDb.report.findUnique.mockResolvedValue(MOCK_REPORT); // Auth check
        mockDb.report.update.mockResolvedValue(updatedReport);

        const result = await reportsRouter.update({
          ctx: authedCtx,
          input: updateInput,
          type: 'mutation',
        });

        expect(mockDb.report.update).toHaveBeenCalledWith({
          where: { id: MOCK_REPORT_ID },
          data: { title: 'Updated Title' },
        });
        expect(result).toEqual(updatedReport);
      });

      // Error Handling
      it('should throw INTERNAL_SERVER_ERROR on database update failure', async () => {
        mockDb.report.findUnique.mockResolvedValue(MOCK_REPORT);
        mockDb.report.update.mockRejectedValue(new Error('DB update error'));

        await expect(
          reportsRouter.update({
            ctx: authedCtx,
            input: { id: MOCK_REPORT_ID, content: 'New' },
            type: 'mutation',
          })
        ).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
      });
    });

    // DELETE
    describe('delete', () => {
      it('should successfully delete a report', async () => {
        mockDb.report.findUnique.mockResolvedValue(MOCK_REPORT); // Auth check
        mockDb.report.delete.mockResolvedValue(MOCK_REPORT); // Mocking successful deletion

        const result = await reportsRouter.delete({
          ctx: authedCtx,
          input: { id: MOCK_REPORT_ID },
          type: 'mutation',
        });

        expect(mockDb.report.delete).toHaveBeenCalledWith({
          where: { id: MOCK_REPORT_ID },
        });
        expect(result).toEqual({ success: true });
      });

      // Error Handling
      it('should throw INTERNAL_SERVER_ERROR on database delete failure', async () => {
        mockDb.report.findUnique.mockResolvedValue(MOCK_REPORT);
        mockDb.report.delete.mockRejectedValue(new Error('DB delete error'));

        await expect(
          reportsRouter.delete({
            ctx: authedCtx,
            input: { id: MOCK_REPORT_ID },
            type: 'mutation',
          })
        ).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
      });
    });
  });

  // --- Input Validation Tests (Validation) & Edge Cases ---
  describe('Input Validation (Zod)', () => {
    const authedCtx = createMockContext(MOCK_USER_ID);
    const mockUuid = '00000000-0000-4000-8000-000000000000'; // Valid UUID for mocking

    // Mocking the DB for successful validation tests
    beforeEach(() => {
        mockDb.report.findUnique.mockResolvedValue({ ...MOCK_REPORT, id: mockUuid });
        mockDb.report.create.mockResolvedValue({ ...MOCK_REPORT, id: mockUuid });
        mockDb.report.update.mockResolvedValue({ ...MOCK_REPORT, id: mockUuid });
        mockDb.report.delete.mockResolvedValue(MOCK_REPORT);
    });

    it('should throw BAD_REQUEST for create with empty title', async () => {
      const input = { title: '', content: 'Valid content' };
      await expect(
        reportsRouter.create({ ctx: authedCtx, input, type: 'mutation' })
      ).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw BAD_REQUEST for create with empty content', async () => {
      const input = { title: 'Valid Title', content: '' };
      await expect(
        reportsRouter.create({ ctx: authedCtx, input, type: 'mutation' })
      ).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw BAD_REQUEST for get with invalid UUID', async () => {
      const input = { id: 'not-a-uuid' };
      await expect(
        reportsRouter.get({ ctx: authedCtx, input: input as any, type: 'query' })
      ).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw BAD_REQUEST for update with invalid UUID', async () => {
      const input = { id: 'not-a-uuid', title: 'New Title' };
      await expect(
        reportsRouter.update({ ctx: authedCtx, input: input as any, type: 'mutation' })
      ).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    // Edge Case: Update with no fields (optional check)
    it('should successfully update a report when only ID is provided (no-op update)', async () => {
      const updateInput = { id: mockUuid };
      const existingReport = { ...MOCK_REPORT, id: mockUuid };
      mockDb.report.findUnique.mockResolvedValue(existingReport);
      mockDb.report.update.mockResolvedValue(existingReport);

      const result = await reportsRouter.update({
        ctx: authedCtx,
        input: updateInput,
        type: 'mutation',
      });

      expect(mockDb.report.update).toHaveBeenCalledWith({
        where: { id: mockUuid },
        data: {}, // Expecting empty data object for no-op update
      });
      expect(result).toEqual(existingReport);
    });
  });
});

// Calculate the number of tests (it blocks)
// Auth: 3
// CRUD/Create: 2
// CRUD/Get: 2
// CRUD/GetAll: 2
// CRUD/Update: 2
// CRUD/Delete: 2
// Validation: 5
// Total: 18 (This is an estimate, the actual count is 18 'it' blocks)

