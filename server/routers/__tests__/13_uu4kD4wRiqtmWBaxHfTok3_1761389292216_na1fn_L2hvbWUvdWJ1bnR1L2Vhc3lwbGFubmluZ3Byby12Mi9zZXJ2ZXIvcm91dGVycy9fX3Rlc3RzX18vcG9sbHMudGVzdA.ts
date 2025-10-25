import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PollCreateSchema, PollUpdateSchema, PollIdSchema, pollsRouter, createContext, db, Session, Poll } from '../../../src/server';
import { inferProcedureInput } from '@trpc/server';
import { TRPCError } from '@trpc/server';

// Mock the tRPC call function for easier testing
type RouterInput = inferProcedureInput<typeof pollsRouter>;

// Setup a mock context for a logged-in user
const mockUserSession: Session = {
  user: {
    id: 'user-123',
    email: 'user@example.com',
    role: 'USER',
  },
};

// Setup a mock context for a logged-out user
const mockGuestSession: Session = {
  user: null,
};

// Helper function to create a context with a specific session
const createMockContext = (session: Session) => ({
  ...createContext({}), // Get base context (including db mock)
  session: session,
});

// Mock Poll Data
const mockPoll: Poll = {
  id: 'poll-cuid-1',
  title: 'What is your favorite color?',
  options: ['Red', 'Blue', 'Green'],
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: null,
  authorId: mockUserSession.user!.id,
};

describe('Polls Router', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 1. CRUD Operations & Database Mocking ---

  describe('create procedure', () => {
    const input: RouterInput['create'] = {
      title: 'New Poll Title',
      options: ['Option A', 'Option B'],
    };

    it('should successfully create a new poll for a logged-in user', async () => {
      // Mock the database create call to return the mock poll data
      db.poll.create.mockResolvedValue(mockPoll);

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      const result = await caller.create(input);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(input.title);
      expect(db.poll.create).toHaveBeenCalledTimes(1);
      expect(db.poll.create.mock.calls[0][0].data.authorId).toBe(mockUserSession.user!.id);
    });

    it('should fail to create a poll if the user is not logged in (Authentication)', async () => {
      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      await expect(caller.create(input)).rejects.toThrow('UNAUTHORIZED');
      expect(db.poll.create).not.toHaveBeenCalled();
    });
  });

  describe('getAll procedure', () => {
    it('should return a list of all polls (public procedure)', async () => {
      const mockPolls: Poll[] = [mockPoll, { ...mockPoll, id: 'poll-cuid-2', title: 'Another Poll' }];
      db.poll.findMany.mockResolvedValue(mockPolls);

      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      const result = await caller.getAll();

      expect(result).toEqual(mockPolls);
      expect(db.poll.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no polls exist (Edge Case: Empty Array)', async () => {
      db.poll.findMany.mockResolvedValue([]);

      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      const result = await caller.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById procedure', () => {
    const input: RouterInput['getById'] = { id: mockPoll.id };

    it('should successfully retrieve a poll by ID', async () => {
      db.poll.findUnique.mockResolvedValue(mockPoll);

      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      const result = await caller.getById(input);

      expect(result).toEqual(mockPoll);
      expect(db.poll.findUnique).toHaveBeenCalledWith({ where: { id: input.id } });
    });

    it('should throw NOT_FOUND error if poll does not exist (Error Handling)', async () => {
      db.poll.findUnique.mockResolvedValue(null);

      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      await expect(caller.getById(input)).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('update procedure', () => {
    const input: RouterInput['update'] = {
      id: mockPoll.id,
      title: 'Updated Poll Title',
    };

    it('should successfully update a poll if the user is the author', async () => {
      // 1. Mock findUnique for authorization check
      db.poll.findUnique.mockResolvedValue(mockPoll);
      // 2. Mock update for the actual operation
      const updatedPoll = { ...mockPoll, title: input.title! };
      db.poll.update.mockResolvedValue(updatedPoll);

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      const result = await caller.update(input);

      expect(result.title).toBe(input.title);
      expect(db.poll.update).toHaveBeenCalledWith({
        where: { id: input.id },
        data: input,
      });
    });

    it('should fail to update a poll if the user is not logged in (Authentication)', async () => {
      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      await expect(caller.update(input)).rejects.toThrow('UNAUTHORIZED');
      expect(db.poll.update).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if the user is not the author (Authorization)', async () => {
      // Mock findUnique to return a poll with a different authorId
      db.poll.findUnique.mockResolvedValue({ ...mockPoll, authorId: 'different-user-id' });

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      await expect(caller.update(input)).rejects.toThrow('FORBIDDEN');
      expect(db.poll.update).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if the poll does not exist (Error Handling/Authorization)', async () => {
      // Mock findUnique to return null
      db.poll.findUnique.mockResolvedValue(null);

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      await expect(caller.update(input)).rejects.toThrow('FORBIDDEN');
      expect(db.poll.update).not.toHaveBeenCalled();
    });
  });

  describe('delete procedure', () => {
    const input: RouterInput['delete'] = { id: mockPoll.id };

    it('should successfully delete a poll if the user is the author', async () => {
      // 1. Mock findUnique for authorization check
      db.poll.findUnique.mockResolvedValue(mockPoll);
      // 2. Mock delete for the actual operation
      db.poll.delete.mockResolvedValue(mockPoll); // delete typically returns the deleted record or nothing

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      const result = await caller.delete(input);

      expect(result).toEqual({ id: input.id });
      expect(db.poll.delete).toHaveBeenCalledWith({ where: { id: input.id } });
    });

    it('should fail to delete a poll if the user is not logged in (Authentication)', async () => {
      const caller = pollsRouter.createCaller(createMockContext(mockGuestSession));
      await expect(caller.delete(input)).rejects.toThrow('UNAUTHORIZED');
      expect(db.poll.delete).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if the user is not the author (Authorization)', async () => {
      // Mock findUnique to return a poll with a different authorId
      db.poll.findUnique.mockResolvedValue({ ...mockPoll, authorId: 'different-user-id' });

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      await expect(caller.delete(input)).rejects.toThrow('FORBIDDEN');
      expect(db.poll.delete).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if the poll does not exist (Error Handling/Authorization)', async () => {
      // Mock findUnique to return null
      db.poll.findUnique.mockResolvedValue(null);

      const caller = pollsRouter.createCaller(createMockContext(mockUserSession));
      await expect(caller.delete(input)).rejects.toThrow('FORBIDDEN');
      expect(db.poll.delete).not.toHaveBeenCalled();
    });
  });

  // --- 2. Input Validation (Zod Schemas) & Edge Cases ---

  describe('Input Validation', () => {
    const caller = pollsRouter.createCaller(createMockContext(mockUserSession));

    it('should fail to create a poll with a title that is too short (Validation)', async () => {
      const invalidInput: RouterInput['create'] = {
        title: 'Short', // Less than 5 chars
        options: ['A', 'B'],
      };
      await expect(caller.create(invalidInput)).rejects.toThrow(TRPCError);
      await expect(caller.create(invalidInput)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(db.poll.create).not.toHaveBeenCalled();
    });

    it('should fail to create a poll with less than two options (Validation)', async () => {
      const invalidInput: RouterInput['create'] = {
        title: 'Valid Title',
        options: ['Only One'], // Less than 2 options
      };
      await expect(caller.create(invalidInput)).rejects.toThrow(TRPCError);
      await expect(caller.create(invalidInput)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(db.poll.create).not.toHaveBeenCalled();
    });

    it('should fail to update a poll with an invalid ID (Edge Case: Invalid ID)', async () => {
      const invalidInput: any = {
        id: 'not-a-cuid',
        title: 'Valid Title',
      };
      // The Zod schema for PollUpdateSchema and PollIdSchema uses z.string().cuid()
      // tRPC will throw a BAD_REQUEST error before the procedure even runs
      await expect(caller.update(invalidInput)).rejects.toThrow(TRPCError);
      await expect(caller.update(invalidInput)).rejects.toHaveProperty('code', 'BAD_REQUEST');
      expect(db.poll.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates (Edge Case: Partial Input)', async () => {
      const partialInput: RouterInput['update'] = {
        id: mockPoll.id,
        options: ['New Option 1', 'New Option 2'], // Only updating options
      };
      db.poll.findUnique.mockResolvedValue(mockPoll);
      const updatedPoll = { ...mockPoll, options: partialInput.options! };
      db.poll.update.mockResolvedValue(updatedPoll);

      const result = await caller.update(partialInput);
      expect(result.options).toEqual(partialInput.options);
      expect(result.title).toBe(mockPoll.title); // Title should remain the same
      expect(db.poll.update).toHaveBeenCalledTimes(1);
    });
  });
});
