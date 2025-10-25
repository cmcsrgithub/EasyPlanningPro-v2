import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory } from '@trpc/server';
import { eventsRouter } from '../events'; // Assuming the router is in '../events'
import { createContextInner } from '../../context'; // Assuming context is here
import { TRPCError } from '@trpc/server';

// Mock the database client (assuming a Drizzle or similar ORM structure)
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  execute: vi.fn().mockResolvedValue({}), // Mock execute for Drizzle
  $with: vi.fn().mockReturnThis(),
  $on: vi.fn().mockReturnThis(),
  $if: vi.fn().mockReturnThis(),
  $as: vi.fn().mockReturnThis(),
  $dynamic: vi.fn().mockReturnThis(),
};

// Mock the context function to control authentication state
// Based on the existing file, the context has a 'user' and 'session' object.
const mockContext = (userId: number | null = 1) => ({
  ...createContextInner(), // Spread any base context properties
  db: mockDb, // Inject the mock database
  session: { userId },
  user: userId ? { id: userId, email: `user${userId}@test.com`, name: `User ${userId}` } : null,
});

// Create a factory for the tRPC caller
const createCaller = createCallerFactory(eventsRouter);

describe('eventsRouter', () => {
  // A caller with a logged-in user (ID 1)
  const authedCaller = createCaller(mockContext(1) as any);
  // A caller with no logged-in user
  const unauthedCaller = createCaller(mockContext(null) as any);

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'A description',
    startDate: new Date('2025-12-01').toISOString(),
    endDate: new Date('2025-12-02').toISOString(),
    location: 'Online',
    createdBy: 1, // Organizer ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEventInput = {
    title: 'New Event',
    description: 'Details',
    startDate: new Date('2025-12-05').toISOString(),
    endDate: new Date('2025-12-06').toISOString(),
    location: 'Venue',
  };

  // Helper to mock the select query for authorization checks
  const mockAuthCheck = (event: typeof mockEvent | null) => {
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.execute.mockResolvedValue(event ? [event] : []);
  };

  // --- 1. CRUD Operations Tests ---

  describe('CRUD Operations', () => {
    // CREATE
    it('should successfully create a new event (CREATE)', async () => {
      mockDb.insert.mockReturnThis();
      mockDb.values.mockReturnThis();
      mockDb.execute.mockResolvedValue({ insertId: 2 }); // Mock successful insertion

      const result = await authedCaller.create(mockEventInput);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(expect.objectContaining({
        ...mockEventInput,
        createdBy: 1, // Check for organizerId from context
      }));
      expect(result).toEqual({ insertId: 2 });
    });

    // READ (Get all/list)
    it('should successfully return a list of events (READ - list)', async () => {
      const mockEventsList = [mockEvent, { ...mockEvent, id: 2, title: 'Second Event' }];
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis(); // Filter by createdBy: 1
      mockDb.execute.mockResolvedValue(mockEventsList);

      const result = await authedCaller.list();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled(); // Should be filtered by the user's ID
      expect(result).toEqual(mockEventsList);
    });

    // READ (Get by ID) - Assuming a 'getById' procedure
    it('should successfully return an event by ID (READ - getById)', async () => {
      mockAuthCheck(mockEvent); // Use auth check helper to mock the select query

      const result = await authedCaller.getById({ id: 1 });

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(result).toEqual(mockEvent);
    });

    // UPDATE
    it('should successfully update an existing event (UPDATE)', async () => {
      mockAuthCheck(mockEvent); // Authorization check passes (user 1 is creator)
      mockDb.update.mockReturnThis();
      mockDb.set.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.execute.mockResolvedValue({ affectedRows: 1 });

      const input = { id: 1, title: 'Updated Title' };

      const result = await authedCaller.update(input);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title' }));
      expect(mockDb.where).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(result).toEqual({ affectedRows: 1 });
    });

    // DELETE
    it('should successfully delete an event (DELETE)', async () => {
      mockAuthCheck(mockEvent); // Authorization check passes (user 1 is creator)
      mockDb.delete.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.execute.mockResolvedValue({ affectedRows: 1 });

      const result = await authedCaller.delete({ id: 1 });

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

  // --- 2. Input Validation (Zod schemas) Tests ---

  describe('Input Validation', () => {
    // Test Zod validation for missing required field
    it('should throw TRPCError on invalid input for create (missing required field)', async () => {
      const invalidInput = {
        description: 'Details',
        startDate: new Date('2025-12-05').toISOString(),
        endDate: new Date('2025-12-06').toISOString(),
        location: 'Venue',
        // 'title' is missing
      };

      // We expect the tRPC procedure to throw a Zod validation error, which tRPC wraps in a TRPCError
      await expect(authedCaller.create(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(authedCaller.create(invalidInput as any)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    // Test Zod validation for date range (end date before start date)
    it('should throw TRPCError for invalid date range (endDate before startDate)', async () => {
      const invalidInput = {
        ...mockEventInput,
        startDate: new Date('2025-12-06').toISOString(),
        endDate: new Date('2025-12-05').toISOString(), // End before start
      };

      await expect(authedCaller.create(invalidInput as any)).rejects.toThrow(TRPCError);
      await expect(authedCaller.create(invalidInput as any)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    // Test Zod validation for invalid ID type
    it('should throw TRPCError on invalid ID format for delete (non-integer)', async () => {
      const invalidInput = { id: 'not-a-number' as any };

      await expect(authedCaller.delete(invalidInput)).rejects.toThrow(TRPCError);
      await expect(authedCaller.delete(invalidInput)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });

  // --- 3. Authentication/Authorization Checks ---

  describe('Authentication/Authorization Checks', () => {
    // Authentication check (must be logged in)
    it('should throw UNAUTHORIZED error if user is not logged in for create', async () => {
      await expect(unauthedCaller.create(mockEventInput)).rejects.toThrow(TRPCError);
      await expect(unauthedCaller.create(mockEventInput)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('should throw UNAUTHORIZED error if user is not logged in for list', async () => {
      await expect(unauthedCaller.list()).rejects.toThrow(TRPCError);
      await expect(unauthedCaller.list()).rejects.toHaveProperty('code', 'UNAUTHORIZED');
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    // Authorization check (must be the creator) - for update
    it('should throw FORBIDDEN error if user is not the creator for update', async () => {
      // Event belongs to user 999
      const foreignEvent = { ...mockEvent, createdBy: 999 };
      mockAuthCheck(foreignEvent); // Auth check passes (event exists)

      const input = { id: 1, title: 'Malicious Update' };

      await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
      await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'FORBIDDEN');
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    // Authorization check (must be the creator) - for delete
    it('should throw FORBIDDEN error if user is not the creator for delete', async () => {
      // Event belongs to user 999
      const foreignEvent = { ...mockEvent, createdBy: 999 };
      mockAuthCheck(foreignEvent); // Auth check passes (event exists)

      const input = { id: 1 };

      await expect(authedCaller.delete(input)).rejects.toThrow(TRPCError);
      await expect(authedCaller.delete(input)).rejects.toHaveProperty('code', 'FORBIDDEN');
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });

  // --- 4. Edge Cases & Error Handling ---

  describe('Edge Cases & Error Handling', () => {
    // Edge case: Event not found
    it('should throw NOT_FOUND error when getting a non-existent event (getById)', async () => {
      mockAuthCheck(null); // Mock select query returns no event

      await expect(authedCaller.getById({ id: 999 })).rejects.toThrow(TRPCError);
      await expect(authedCaller.getById({ id: 999 })).rejects.toHaveProperty('code', 'NOT_FOUND');
    });

    // Edge case: Empty array return for list
    it('should return an empty array if no events are found (list)', async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.execute.mockResolvedValue([]);

      const result = await authedCaller.list();

      expect(result).toEqual([]);
    });

    // Error handling: Database failure
    it('should throw INTERNAL_SERVER_ERROR on database failure during create', async () => {
      const dbError = new Error('Database connection failed');
      mockDb.insert.mockReturnThis();
      mockDb.values.mockReturnThis();
      mockDb.execute.mockRejectedValue(dbError);

      // Assuming a try/catch block in the router procedure re-throws as TRPCError
      await expect(authedCaller.create(mockEventInput)).rejects.toThrow(TRPCError);
      await expect(authedCaller.create(mockEventInput)).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
    });

    // Edge case: Update/Delete on non-existent event
    it('should throw NOT_FOUND error when trying to update a non-existent event', async () => {
      mockAuthCheck(null); // Mock select query returns no event

      const input = { id: 999, title: 'Should Fail' };

      await expect(authedCaller.update(input)).rejects.toThrow(TRPCError);
      await expect(authedCaller.update(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });
});

// Total test count: 17
// Coverage Areas: CRUD, Input Validation (Zod), Authentication/Authorization, Edge Cases, Error Handling, Database Mocking

