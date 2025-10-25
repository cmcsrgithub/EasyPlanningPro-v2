// /home/ubuntu/easyplanningpro-v2/server/routers/__tests__/gallery.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { galleryRouter } from '../gallery';
import { setupTest, prisma } from './test-utils';
import { type GalleryRouter } from '../gallery';

// Helper function to create a callable procedure for the router
const createCaller = (ctx: any) => {
  return (procedureName: keyof GalleryRouter['_def']['procedures'], input: any) => {
    const procedure = galleryRouter._def.procedures[procedureName];
    if (!procedure) {
      throw new Error(`Procedure ${String(procedureName)} not found`);
    }
    // @ts-ignore - tRPC procedure calling signature
    return procedure({ ctx, input });
  };
};

describe('Gallery Router', () => {
  const mockGallery = {
    id: 'clg72945e000008k96d4g4g4g',
    title: 'Test Gallery',
    description: 'A gallery for testing',
    isPublic: false,
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  // --- CRUD Operations Tests ---

  describe('CRUD Operations', () => {
    it('should successfully create a new gallery (create)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { title: 'New Gallery', description: 'Test description', isPublic: true };

      // Mock the Prisma create call to return the expected object
      prisma.gallery.create.mockResolvedValueOnce({
        ...mockGallery,
        ...input,
        userId: ctx.session.user.id,
      });

      const result = await caller('create', input);

      expect(prisma.gallery.create).toHaveBeenCalledWith({
        data: {
          ...input,
          userId: 'test-user-id',
        },
      });
      expect(result.title).toBe('New Gallery');
    });

    it('should successfully list public galleries (list)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const mockPublicGalleries = [
        { ...mockGallery, id: '1', isPublic: true },
        { ...mockGallery, id: '2', isPublic: true },
      ];

      prisma.gallery.findMany.mockResolvedValueOnce(mockPublicGalleries);

      const result = await caller('list', undefined);

      expect(prisma.gallery.findMany).toHaveBeenCalledWith({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].isPublic).toBe(true);
    });

    it('should successfully get a public gallery by ID (get)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };
      const publicGallery = { ...mockGallery, isPublic: true };

      prisma.gallery.findUnique.mockResolvedValueOnce(publicGallery);

      const result = await caller('get', input);

      expect(prisma.gallery.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
      expect(result.id).toBe(mockGallery.id);
    });

    it('should successfully update an existing gallery (update)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id, title: 'Updated Title' };

      // 1. Mock findUnique for ownership check
      prisma.gallery.findUnique.mockResolvedValueOnce(mockGallery);
      // 2. Mock update
      prisma.gallery.update.mockResolvedValueOnce({ ...mockGallery, title: 'Updated Title' });

      const result = await caller('update', input);

      expect(prisma.gallery.findUnique).toHaveBeenCalledWith({ where: { id: input.id } });
      expect(prisma.gallery.update).toHaveBeenCalledWith({
        where: { id: input.id },
        data: { title: 'Updated Title' },
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should successfully delete a gallery (delete)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };

      // Mock delete operation
      prisma.gallery.delete.mockResolvedValueOnce(mockGallery);

      const result = await caller('delete', input);

      expect(prisma.gallery.delete).toHaveBeenCalledWith({
        where: { id: input.id },
      });
      expect(result.success).toBe(true);
    });
  });

  // --- Input Validation Tests (Zod) ---

  describe('Input Validation (Zod)', () => {
    it('should throw BAD_REQUEST for invalid input on create (short title)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { title: 'ab', isPublic: false }; // Title too short

      await expect(caller('create', input)).rejects.toThrow(TRPCError);
      await expect(caller('create', input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });

    it('should throw BAD_REQUEST for invalid ID on get', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: 'invalid-id' }; // Not a CUID

      await expect(caller('get', input)).rejects.toThrow(TRPCError);
      await expect(caller('get', input)).rejects.toHaveProperty('code', 'BAD_REQUEST');
    });
  });

  // --- Authentication/Authorization Tests ---

  describe('Authentication/Authorization', () => {
    it('should throw UNAUTHORIZED for unauthenticated user on protected procedure (create)', async () => {
      const { ctx } = setupTest();
      // Manually set session to null for unauthenticated test
      ctx.session = null;
      const caller = createCaller(ctx);
      const input = { title: 'Unauthorized', isPublic: false };

      await expect(caller('create', input)).rejects.toThrow(TRPCError);
      await expect(caller('create', input)).rejects.toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should throw FORBIDDEN when non-owner tries to update a gallery', async () => {
      const { ctx } = setupTest();
      // Change user ID to be a non-owner
      ctx.session.user.id = 'non-owner-id';
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id, title: 'Attempted Update' };

      // 1. Mock findUnique for ownership check (returns gallery owned by 'test-user-id')
      prisma.gallery.findUnique.mockResolvedValueOnce(mockGallery);

      await expect(caller('update', input)).rejects.toThrow(TRPCError);
      await expect(caller('update', input)).rejects.toHaveProperty('code', 'FORBIDDEN');
      expect(prisma.gallery.update).not.toHaveBeenCalled(); // Ensure no database write
    });

    it('should allow ADMIN to update a gallery they do not own', async () => {
      const { ctx } = setupTest();
      // Set user role to ADMIN
      ctx.session.user.role = 'ADMIN';
      ctx.session.user.id = 'admin-user-id'; // Admin user ID is different from owner ID
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id, title: 'Admin Update' };

      // 1. Mock findUnique for ownership check (returns gallery owned by 'test-user-id')
      prisma.gallery.findUnique.mockResolvedValueOnce(mockGallery);
      // 2. Mock update
      prisma.gallery.update.mockResolvedValueOnce({ ...mockGallery, title: 'Admin Update' });

      const result = await caller('update', input);

      expect(result.title).toBe('Admin Update');
      expect(prisma.gallery.update).toHaveBeenCalled();
    });

    it('should throw FORBIDDEN for non-admin user on admin procedure (delete)', async () => {
      const { ctx } = setupTest();
      // Default user role is USER (from setupTest, but we'll enforce it here)
      ctx.session.user.role = 'USER';
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };

      await expect(caller('delete', input)).rejects.toThrow(TRPCError);
      await expect(caller('delete', input)).rejects.toHaveProperty('code', 'FORBIDDEN');
      expect(prisma.gallery.delete).not.toHaveBeenCalled();
    });

    it('should allow ADMIN user on admin procedure (delete)', async () => {
      const { ctx } = setupTest();
      // Set user role to ADMIN
      ctx.session.user.role = 'ADMIN';
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };

      prisma.gallery.delete.mockResolvedValueOnce(mockGallery);

      const result = await caller('delete', input);

      expect(result.success).toBe(true);
      expect(prisma.gallery.delete).toHaveBeenCalled();
    });
  });

  // --- Edge Cases and Error Handling Tests ---

  describe('Edge Cases and Error Handling', () => {
    it('should return empty array when no public galleries exist (list edge case)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);

      prisma.gallery.findMany.mockResolvedValueOnce([]);

      const result = await caller('list', undefined);

      expect(result).toEqual([]);
    });

    it('should throw NOT_FOUND when getting a non-existent gallery (get edge case)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: 'non-existent-id' };

      prisma.gallery.findUnique.mockResolvedValueOnce(null);

      await expect(caller('get', input)).rejects.toThrow(TRPCError);
      await expect(caller('get', input)).rejects.toHaveProperty('code', 'NOT_FOUND');
    });

    it('should throw NOT_FOUND when updating a non-existent gallery (update edge case)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { id: 'non-existent-id', title: 'Should Fail' };

      // Mock findUnique for ownership check
      prisma.gallery.findUnique.mockResolvedValueOnce(null);

      await expect(caller('update', input)).rejects.toThrow(TRPCError);
      await expect(caller('update', input)).rejects.toHaveProperty('code', 'NOT_FOUND');
      expect(prisma.gallery.update).not.toHaveBeenCalled();
    });

    it('should throw INTERNAL_SERVER_ERROR on database failure (create error handling)', async () => {
      const { ctx } = setupTest();
      const caller = createCaller(ctx);
      const input = { title: 'Failing Gallery', isPublic: false };

      // Mock the Prisma call to throw an error
      prisma.gallery.create.mockRejectedValueOnce(new Error('DB connection failed'));

      await expect(caller('create', input)).rejects.toThrow(TRPCError);
      await expect(caller('create', input)).rejects.toHaveProperty('code', 'INTERNAL_SERVER_ERROR');
    });

    it('should throw NOT_FOUND when non-public gallery is requested by non-owner (get authorization edge case)', async () => {
      const { ctx } = setupTest();
      // Change user ID to be a non-owner
      ctx.session.user.id = 'non-owner-id';
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };
      const privateGallery = { ...mockGallery, isPublic: false }; // Private gallery owned by 'test-user-id'

      prisma.gallery.findUnique.mockResolvedValueOnce(privateGallery);

      await expect(caller('get', input)).rejects.toThrow(TRPCError);
      await expect(caller('get', input)).rejects.toHaveProperty('code', 'NOT_FOUND');
    });

    it('should allow owner to get a non-public gallery (get authorization success)', async () => {
      const { ctx } = setupTest();
      // User ID is 'test-user-id' (the owner)
      ctx.session.user.id = mockGallery.userId;
      const caller = createCaller(ctx);
      const input = { id: mockGallery.id };
      const privateGallery = { ...mockGallery, isPublic: false };

      prisma.gallery.findUnique.mockResolvedValueOnce(privateGallery);

      const result = await caller('get', input);

      expect(result.id).toBe(mockGallery.id);
      expect(result.isPublic).toBe(false);
    });
  });
});

