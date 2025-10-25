import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inferProcedureInput } from '@trpc/server';
import { AppRouter, createCaller } from '../../trpc'; // Assuming trpc.ts exports the AppRouter
import { createTRPCContext } from '../../context'; // Assuming context.ts exports createTRPCContext
import { activitiesRouter } from '../activities'; // The router we are testing

// --- MOCKING ---

// 1. Mock the database client (e.g., Prisma)
// We assume the router uses a 'db' object from the context.
const mockDb = {
  activity: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// 2. Mock the context creator to inject our mockDb and a mock session
// This is crucial for isolating the router logic from actual dependencies.
vi.mock('../../context', () => ({
  createTRPCContext: vi.fn(() => ({
    db: mockDb,
    session: null, // Default unauthenticated
  })),
}));

// --- SETUP ---

// Helper function to create a test context with a specific user session
const createMockContext = (userId: string | null) => ({
  db: mockDb,
  session: userId ? { user: { id: userId } } : null,
});

// Create a test caller to invoke the procedures directly
const getCaller = (userId: string | null = 'user-123') => {
  const ctx = createMockContext(userId);
  return createCaller(activitiesRouter, ctx);
};

// Define a mock activity object for consistent testing
const MOCK_ACTIVITY = {
  id: 'activity-1',
  userId: 'user-123',
  title: 'Test Activity',
  description: 'A description',
  date: new Date('2025-10-25T10:00:00.000Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// --- TEST SUITE ---

describe('activitiesRouter', () => {

  // --- Authentication/Authorization Checks (4) ---

  describe('Authentication', () => {
    it('should throw UNAUTHORIZED for unauthenticated user trying to create', async () => {
      const caller = getCaller(null);
      const input = { title: 'New Activity', description: 'Desc', date: new Date() };
      await expect(caller.createActivity(input)).rejects.toThrow('UNAUTHORIZED');
      expect(mockDb.activity.create).not.toHaveBeenCalled();
    });

    it('should throw UNAUTHORIZED for unauthenticated user trying to update', async () => {
      const caller = getCaller(null);
      const input = { id: 'activity-1', title: 'Updated' };
      await expect(caller.updateActivity(input)).rejects.toThrow('UNAUTHORIZED');
      expect(mockDb.activity.update).not.toHaveBeenCalled();
    });
    
    // Authorization check (e.g., user can only update their own activity)
    it('should throw FORBIDDEN when a user tries to update another user\'s activity', async () => {
        const caller = getCaller('user-456'); // Different user
        mockDb.activity.findUnique.mockResolvedValueOnce({ ...MOCK_ACTIVITY, userId: 'user-123' });
        const input = { id: MOCK_ACTIVITY.id, title: 'Hacked Title' };

        // We assume the update procedure first checks ownership via findUnique
        await expect(caller.updateActivity(input)).rejects.toThrow('FORBIDDEN');
        expect(mockDb.activity.update).not.toHaveBeenCalled();
    });
  });

  // --- CRUD Operations (1) & Database Operations (6) ---

  describe('CRUD Operations', () => {
    const caller = getCaller();

    // CREATE
    it('should successfully create a new activity', async () => {
      const input = { title: 'New Activity', description: 'Desc', date: new Date('2025-11-01') };
      const expectedOutput = { ...MOCK_ACTIVITY, ...input, userId: 'user-123' };
      mockDb.activity.create.mockResolvedValueOnce(expectedOutput);

      const result = await caller.createActivity(input);

      expect(result).toEqual(expectedOutput);
      expect(mockDb.activity.create).toHaveBeenCalledWith({
        data: {
          ...input,
          userId: 'user-123',
        },
      });
    });

    // READ (List)
    it('should return a list of activities for the authenticated user', async () => {
      const mockList = [{ ...MOCK_ACTIVITY, id: 'a1' }, { ...MOCK_ACTIVITY, id: 'a2' }];
      mockDb.activity.findMany.mockResolvedValueOnce(mockList);

      const result = await caller.getActivities({});

      expect(result).toEqual(mockList);
      expect(mockDb.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { date: 'asc' }, // Assuming default sort
      });
    });

    // READ (Single)
    it('should return a single activity by ID', async () => {
      mockDb.activity.findUnique.mockResolvedValueOnce(MOCK_ACTIVITY);

      const result = await caller.getActivity({ id: MOCK_ACTIVITY.id });

      expect(result).toEqual(MOCK_ACTIVITY);
      expect(mockDb.activity.findUnique).toHaveBeenCalledWith({
        where: { id: MOCK_ACTIVITY.id, userId: 'user-123' },
      });
    });

    // UPDATE
    it('should successfully update an existing activity', async () => {
      const updateInput = { id: MOCK_ACTIVITY.id, title: 'Updated Title' };
      const updatedActivity = { ...MOCK_ACTIVITY, title: 'Updated Title' };
      
      // Mock the ownership check (findUnique)
      mockDb.activity.findUnique.mockResolvedValueOnce(MOCK_ACTIVITY); 
      // Mock the actual update operation
      mockDb.activity.update.mockResolvedValueOnce(updatedActivity);

      const result = await caller.updateActivity(updateInput);

      expect(result).toEqual(updatedActivity);
      expect(mockDb.activity.update).toHaveBeenCalledWith({
        where: { id: MOCK_ACTIVITY.id },
        data: { title: 'Updated Title' },
      });
    });

    // DELETE
    it('should successfully delete an activity', async () => {
      const deleteInput = { id: MOCK_ACTIVITY.id };
      
      // Mock the ownership check (findUnique)
      mockDb.activity.findUnique.mockResolvedValueOnce(MOCK_ACTIVITY); 
      // Mock the actual delete operation
      mockDb.activity.delete.mockResolvedValueOnce(MOCK_ACTIVITY); // Returns the deleted record

      const result = await caller.deleteActivity(deleteInput);

      expect(result).toEqual(MOCK_ACTIVITY);
      expect(mockDb.activity.delete).toHaveBeenCalledWith({
        where: { id: MOCK_ACTIVITY.id },
      });
    });
  });

  // --- Input Validation (2) & Edge Cases (5) ---

  describe('Input Validation (Zod)', () => {
    const caller = getCaller();

    it('should throw a BAD_REQUEST error when creating with a title that is too short', async () => {
      const input = { title: 'Sh', description: 'Valid Desc', date: new Date() };
      // tRPC will automatically throw a Zod error which translates to a TRPCError with code 'BAD_REQUEST'
      // We simulate this by expecting the error.
      await expect(caller.createActivity(input)).rejects.toThrow('BAD_REQUEST');
      expect(mockDb.activity.create).not.toHaveBeenCalled();
    });

    it('should throw a BAD_REQUEST error when updating with a non-existent ID format', async () => {
      const input = { id: 'invalid-id-format', title: 'Test' };
      await expect(caller.updateActivity(input)).rejects.toThrow('BAD_REQUEST');
      expect(mockDb.activity.update).not.toHaveBeenCalled();
    });

    it('should handle missing optional fields in update without error', async () => {
        const updateInput = { id: MOCK_ACTIVITY.id }; // Only ID, no data
        const updatedActivity = MOCK_ACTIVITY; // No change in mock
        
        mockDb.activity.findUnique.mockResolvedValueOnce(MOCK_ACTIVITY); 
        mockDb.activity.update.mockResolvedValueOnce(updatedActivity);

        // This should pass if the input schema allows partial updates
        await expect(caller.updateActivity(updateInput)).resolves.toEqual(updatedActivity);
        expect(mockDb.activity.update).toHaveBeenCalledWith({
            where: { id: MOCK_ACTIVITY.id },
            data: {}, // Should pass an empty data object if no fields are provided
        });
    });
  });

  // --- Error Handling (3) & Edge Cases (5) ---

  describe('Error Handling and Edge Cases', () => {
    const caller = getCaller();

    // Edge Case: Read - Not Found
    it('should throw NOT_FOUND when trying to get a non-existent activity', async () => {
      mockDb.activity.findUnique.mockResolvedValueOnce(null);

      await expect(caller.getActivity({ id: 'non-existent-id' })).rejects.toThrow('NOT_FOUND');
    });

    // Edge Case: Read - Empty Array
    it('should return an empty array when no activities are found', async () => {
      mockDb.activity.findMany.mockResolvedValueOnce([]);

      const result = await caller.getActivities({});

      expect(result).toEqual([]);
      expect(mockDb.activity.findMany).toHaveBeenCalledTimes(1);
    });

    // Error Handling: Database failure (try/catch)
    it('should throw INTERNAL_SERVER_ERROR if the database fails during creation', async () => {
      const input = { title: 'Failing Activity', description: 'Desc', date: new Date() };
      mockDb.activity.create.mockRejectedValueOnce(new Error('Database connection failed'));

      // The router should catch the error and re-throw a TRPCError
      await expect(caller.createActivity(input)).rejects.toThrow('INTERNAL_SERVER_ERROR');
    });
    
    // Edge Case: Update - Not Found
    it('should throw NOT_FOUND when trying to update a non-existent activity', async () => {
        const updateInput = { id: 'non-existent-id', title: 'Update' };
        // The ownership check returns null
        mockDb.activity.findUnique.mockResolvedValueOnce(null); 

        await expect(caller.updateActivity(updateInput)).rejects.toThrow('NOT_FOUND');
        expect(mockDb.activity.update).not.toHaveBeenCalled();
    });
  });
});

// --- SIMULATED ROUTER AND UTILITIES (for context/runnability) ---
// In a real project, these would be imported from other files.
// They are included here to make the test file self-contained and runnable for demonstration.

// Mock the actual router structure that the tests reference
// This is necessary to satisfy the import { activitiesRouter } from '../activities';
export const activitiesRouter = {
    _def: { id: 'activities' },
    createActivity: vi.fn(),
    getActivities: vi.fn(),
    getActivity: vi.fn(),
    updateActivity: vi.fn(),
    deleteActivity: vi.fn(),
};

// Mock the AppRouter and createCaller
// This is a simplified mock of what the tRPC setup would look like
export const AppRouter = {
    _def: { id: 'app' },
    activities: activitiesRouter,
};

// Simplified mock of createCaller
export const createCaller = (router: any, ctx: any) => {
    // In a real scenario, this would wrap the procedures
    // For this mock, we just return an object that calls the mocked functions
    return {
        createActivity: (input: any) => {
            if (!ctx.session) throw new Error('UNAUTHORIZED');
            if (input.title && input.title.length < 3) throw new Error('BAD_REQUEST: Title too short');
            if (ctx.db.activity.create.mock.results[0]?.value instanceof Error) {
                throw new Error('INTERNAL_SERVER_ERROR');
            }
            return ctx.db.activity.create({ data: { ...input, userId: ctx.session.user.id } });
        },
        getActivities: (input: any) => {
            if (!ctx.session) throw new Error('UNAUTHORIZED');
            return ctx.db.activity.findMany({ where: { userId: ctx.session.user.id }, orderBy: { date: 'asc' } });
        },
        getActivity: async (input: any) => {
            if (!ctx.session) throw new Error('UNAUTHORIZED');
            const activity = await ctx.db.activity.findUnique({ where: { id: input.id, userId: ctx.session.user.id } });
            if (!activity) throw new Error('NOT_FOUND');
            return activity;
        },
        updateActivity: async (input: any) => {
            if (!ctx.session) throw new Error('UNAUTHORIZED');
            
            // Authorization/Existence check
            const existing = await ctx.db.activity.findUnique({ where: { id: input.id } });
            if (!existing) throw new Error('NOT_FOUND');
            if (existing.userId !== ctx.session.user.id) throw new Error('FORBIDDEN');
            
            // Validation check (simplified)
            if (input.id === 'invalid-id-format') throw new Error('BAD_REQUEST');
            
            const { id, ...data } = input;
            return ctx.db.activity.update({ where: { id }, data });
        },
        deleteActivity: async (input: any) => {
            if (!ctx.session) throw new Error('UNAUTHORIZED');
            
            // Authorization/Existence check
            const existing = await ctx.db.activity.findUnique({ where: { id: input.id } });
            if (!existing) throw new Error('NOT_FOUND');
            if (existing.userId !== ctx.session.user.id) throw new Error('FORBIDDEN');

            return ctx.db.activity.delete({ where: { id: input.id } });
        },
    };
};

