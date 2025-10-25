// /home/ubuntu/easyplanningpro-v2/server/routers/__tests__/rsvps.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inferProcedureInput } from '@trpc/server';
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';
import { appRouter, AppRouter } from '../../_app'; // Assuming _app.ts exports the main router
import { createContextInner } from '../../context'; // Assuming context.ts exports a function to create context
import * as db from '../../../db/client'; // Assuming a database client
import { TRPCError } from '@trpc/server';

// Mock the database client
vi.mock('../../../db/client', () => ({
  db: {
    rsvp: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Helper to create a test caller
const createCaller = createCallerFactory(appRouter);

// --- Mock Data ---
const mockUserId = 'user-123';
const mockEventId = 'event-456';
const mockRsvpId = 'rsvp-789';
const mockRsvp = {
  id: mockRsvpId,
  eventId: mockEventId,
  userId: mockUserId,
  status: 'ATTENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Test Suite ---
describe('rsvpsRouter', () => {
  // A context for authenticated user
  const authenticatedContext = createContextInner({
    session: { user: { id: mockUserId, name: 'Test User' } },
  });

  // A context for unauthenticated user
  const unauthenticatedContext = createContextInner({ session: null });

  // Caller for authenticated user
  const authCaller = createCaller(authenticatedContext);

  // Caller for unauthenticated user
  const unauthCaller = createCaller(unauthenticatedContext);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock event existence for valid operations
    (db.db.event.findUnique as vi.Mock).mockResolvedValue({ id: mockEventId });
  });

  // =================================================================
  // 1. Authentication/Authorization Checks (Security)
  // =================================================================
  describe('Authentication Checks', () => {
    it('should throw UNAUTHORIZED for unauthenticated user trying to create', async () => {
      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      const input: Input = { eventId: mockEventId, status: 'ATTENDING' };

      await expect(unauthCaller.rsvps.create(input)).rejects.toThrow(TRPCError);
      await expect(unauthCaller.rsvps.create(input)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should throw UNAUTHORIZED for unauthenticated user trying to update', async () => {
      type Input = inferProcedureInput<AppRouter['rsvps']['update']>;
      const input: Input = { id: mockRsvpId, status: 'NOT_ATTENDING' };

      await expect(unauthCaller.rsvps.update(input)).rejects.toThrow(TRPCError);
      await expect(unauthCaller.rsvps.update(input)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should allow authenticated user to read (getById)', async () => {
        (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(mockRsvp);
        const result = await authCaller.rsvps.getById({ id: mockRsvpId });
        expect(result).toEqual(mockRsvp);
    });
  });

  // =================================================================
  // 2. CRUD Operations (Happy Path)
  // =================================================================
  describe('CRUD Operations', () => {
    // --- Create ---
    it('should successfully create a new RSVP', async () => {
      (db.db.rsvp.create as vi.Mock).mockResolvedValue(mockRsvp);
      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      const input: Input = { eventId: mockEventId, status: 'ATTENDING' };

      const result = await authCaller.rsvps.create(input);

      expect(db.db.rsvp.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventId: mockEventId,
          userId: mockUserId,
          status: 'ATTENDING',
        }),
      });
      expect(result).toEqual(mockRsvp);
    });

    // --- Read (getById) ---
    it('should successfully retrieve an RSVP by ID', async () => {
      (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(mockRsvp);
      const result = await authCaller.rsvps.getById({ id: mockRsvpId });

      expect(db.db.rsvp.findUnique).toHaveBeenCalledWith({ where: { id: mockRsvpId } });
      expect(result).toEqual(mockRsvp);
    });

    // --- Read (getByEventId) ---
    it('should successfully retrieve a list of RSVPs for an event', async () => {
      const mockRsvps = [mockRsvp, { ...mockRsvp, id: 'rsvp-999', userId: 'user-999' }];
      (db.db.rsvp.findMany as vi.Mock).mockResolvedValue(mockRsvps);

      const result = await authCaller.rsvps.getByEventId({ eventId: mockEventId });

      expect(db.db.rsvp.findMany).toHaveBeenCalledWith({ where: { eventId: mockEventId } });
      expect(result).toEqual(mockRsvps);
    });

    // --- Update ---
    it('should successfully update an RSVP status', async () => {
      const updatedRsvp = { ...mockRsvp, status: 'NOT_ATTENDING' };
      (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(mockRsvp); // Check auth/ownership
      (db.db.rsvp.update as vi.Mock).mockResolvedValue(updatedRsvp);

      type Input = inferProcedureInput<AppRouter['rsvps']['update']>;
      const input: Input = { id: mockRsvpId, status: 'NOT_ATTENDING' };

      const result = await authCaller.rsvps.update(input);

      expect(db.db.rsvp.update).toHaveBeenCalledWith({
        where: { id: mockRsvpId },
        data: { status: 'NOT_ATTENDING' },
      });
      expect(result).toEqual(updatedRsvp);
    });

    // --- Delete ---
    it('should successfully delete an RSVP', async () => {
      (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(mockRsvp); // Check auth/ownership
      (db.db.rsvp.delete as vi.Mock).mockResolvedValue(mockRsvp); // Returns the deleted object

      const result = await authCaller.rsvps.delete({ id: mockRsvpId });

      expect(db.db.rsvp.delete).toHaveBeenCalledWith({ where: { id: mockRsvpId } });
      expect(result).toEqual(mockRsvp);
    });
  });

  // =================================================================
  // 3. Input Validation (Zod Schemas)
  // =================================================================
  describe('Input Validation', () => {
    it('should throw a BAD_REQUEST error for invalid status in create', async () => {
      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      // @ts-ignore - intentionally providing invalid input for testing Zod
      const input: Input = { eventId: mockEventId, status: 'INVALID_STATUS' };

      await expect(authCaller.rsvps.create(input)).rejects.toThrow(TRPCError);
      await expect(authCaller.rsvps.create(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw a BAD_REQUEST error for missing eventId in create', async () => {
      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      // @ts-ignore - intentionally providing invalid input for testing Zod
      const input: Input = { status: 'ATTENDING' };

      await expect(authCaller.rsvps.create(input)).rejects.toThrow(TRPCError);
      await expect(authCaller.rsvps.create(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw a BAD_REQUEST error for invalid ID format in getById', async () => {
        type Input = inferProcedureInput<AppRouter['rsvps']['getById']>;
        // @ts-ignore - assuming ID is a string but passing a number
        const input: Input = { id: 12345 };

        await expect(authCaller.rsvps.getById(input)).rejects.toThrow(TRPCError);
        await expect(authCaller.rsvps.getById(input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });
  });

  // =================================================================
  // 4. Edge Cases and Error Handling
  // =================================================================
  describe('Edge Cases and Error Handling', () => {
    // --- Read Edge Case (Not Found) ---
    it('should return null/undefined when an RSVP is not found (getById)', async () => {
      (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(null);
      const result = await authCaller.rsvps.getById({ id: 'non-existent-id' });
      expect(result).toBeFalsy(); // Should be null or undefined depending on implementation
    });

    // --- Read Edge Case (Empty List) ---
    it('should return an empty array when no RSVPs are found for an event (getByEventId)', async () => {
      (db.db.rsvp.findMany as vi.Mock).mockResolvedValue([]);
      const result = await authCaller.rsvps.getByEventId({ eventId: 'event-with-no-rsvps' });
      expect(result).toEqual([]);
    });

    // --- Authorization Edge Case (Updating another user's RSVP) ---
    it('should throw FORBIDDEN when a user tries to update another user\'s RSVP', async () => {
      // Mock the RSVP to belong to a different user
      const otherUserRsvp = { ...mockRsvp, userId: 'other-user-999' };
      (db.db.rsvp.findUnique as vi.Mock).mockResolvedValue(otherUserRsvp); // Found the RSVP
      (db.db.rsvp.update as vi.Mock).mockResolvedValue(otherUserRsvp); // Mock the update to not be called

      type Input = inferProcedureInput<AppRouter['rsvps']['update']>;
      const input: Input = { id: mockRsvpId, status: 'NOT_ATTENDING' };

      await expect(authCaller.rsvps.update(input)).rejects.toThrow(TRPCError);
      await expect(authCaller.rsvps.update(input)).rejects.toHaveProperty('code', 'FORBIDDEN');
      expect(db.db.rsvp.update).not.toHaveBeenCalled();
    });

    // --- Error Handling (Database failure) ---
    it('should throw an INTERNAL_SERVER_ERROR on a database failure during creation', async () => {
      const dbError = new Error('Database connection failed');
      (db.db.rsvp.create as vi.Mock).mockRejectedValue(dbError);

      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      const input: Input = { eventId: mockEventId, status: 'ATTENDING' };

      await expect(authCaller.rsvps.create(input)).rejects.toThrow(TRPCError);
      await expect(authCaller.rsvps.create(input)).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
    });

    // --- Create Edge Case (Event does not exist) ---
    it('should throw a NOT_FOUND error if the event does not exist during creation', async () => {
      // Reset event mock to return null
      (db.db.event.findUnique as vi.Mock).mockResolvedValue(null);

      type Input = inferProcedureInput<AppRouter['rsvps']['create']>;
      const input: Input = { eventId: 'non-existent-event', status: 'ATTENDING' };

      await expect(authCaller.rsvps.create(input)).rejects.toThrow(TRPCError);
      await expect(authCaller.rsvps.create(input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      expect(db.db.rsvp.create).not.toHaveBeenCalled();
    });
  });
});

// Test Count: 13
// Coverage Areas: CRUD (Create, Read, Update, Delete), Input Validation (Zod), Error Handling (DB failure, Not Found), Authentication (UNAUTHORIZED), Authorization (FORBIDDEN), Edge Cases (Not Found, Empty List, Invalid ID)

