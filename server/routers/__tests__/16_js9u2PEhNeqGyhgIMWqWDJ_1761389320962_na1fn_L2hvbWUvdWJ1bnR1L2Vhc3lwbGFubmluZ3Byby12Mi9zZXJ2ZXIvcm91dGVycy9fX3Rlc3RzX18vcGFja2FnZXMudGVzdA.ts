import { describe, it, expect, vi, beforeEach } from "vitest";
import { packagesRouter } from "../packages";
import { mockDeep } from "vitest-mock-extended";
import { type DeepMockProxy } from "vitest-mock-extended";
import { type DrizzleDb, getDb } from "../../db";
import { type Context } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";

// Mock the getDb function to return a mocked DrizzleDb instance
vi.mock("../../db", () => {
  const mockDb = mockDeep<DrizzleDb>();
  return {
    getDb: vi.fn(() => mockDb),
    // Export the mock instance so we can access it in tests
    mockDb: mockDb, 
  };
});

// Get the mocked database instance from the mocked module
const { mockDb } = await import("../../db");
const mockedDb = mockDb as DeepMockProxy<DrizzleDb>;

// Helper function to create a mock context for protected procedures
const createMockContext = (isLoggedIn: boolean = true) => {
  const user = isLoggedIn
    ? { id: "user-123", name: "Test User", email: "test@example.com" }
    : undefined;
  return {
    user: user,
    // Mocking other context properties if necessary, e.g., session, req, res
  } as Context;
};

// Helper function to call a procedure
const callProcedure = async (procedure: keyof typeof packagesRouter._def.procedures, input: any, ctx: Context) => {
  const caller = packagesRouter.createCaller(ctx);
  return (caller as any)[procedure](input);
};

describe("packagesRouter", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    (getDb as any).mockResolvedValue(mockedDb);
    // Mock the select and other chainable methods to return a mock object
    // This is a common pattern for Drizzle mocking with vitest-mock-extended
    mockedDb.select.mockReturnValue(mockDeep() as any);
    mockedDb.insert.mockReturnValue(mockDeep() as any);
    mockedDb.delete.mockReturnValue(mockDeep() as any);
    mockedDb.update.mockReturnValue(mockDeep() as any);
  });

  // --- Mock Data ---
  const mockPackage = {
    id: "pkg-1",
    userId: "user-123",
    title: "Basic Package",
    description: "A basic package",
    price: "100.00",
    imageUrl: null,
    isActive: true,
    createdAt: new Date(),
  };

  const mockEvent = {
    id: "evt-1",
    title: "Event 1",
    description: "Desc 1",
  };

  const mockPackageEvent = {
    id: "pkgevt-1",
    packageId: "pkg-1",
    eventId: "evt-1",
    orderIndex: 0,
  };

  // =========================================================================
  // 1. READ Operations (list, get)
  // =========================================================================

  describe("list", () => {
    it("should list all active packages", async () => {
      const mockResult = [mockPackage, { ...mockPackage, id: "pkg-2", title: "Premium Package" }];
      
      // Mock the Drizzle chain for the list query
      // db.select().from(eventPackages).where(eq(eventPackages.isActive, true)).orderBy(eventPackages.createdAt)
      mockedDb.select.mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await callProcedure("list", undefined, createMockContext(false));

      expect(result).toEqual(mockResult);
      expect(mockedDb.select).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the database is not available (Edge Case)", async () => {
      (getDb as any).mockResolvedValue(null);

      await expect(
        callProcedure("list", undefined, createMockContext(false))
      ).rejects.toThrow("Database not available");
    });
  });

  describe("get", () => {
    const input = { id: mockPackage.id };
    const ctx = createMockContext(false);

    it("should return a package with its events", async () => {
      // Mock the package fetch
      mockedDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockPackage]), // First select: package
      } as any).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([mockPackageEvent]), // Second select: package events
      } as any).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockEvent]), // Third select: event details
      } as any);

      const result = await callProcedure("get", input, ctx);

      expect(result).toEqual({ ...mockPackage, events: [mockEvent] });
      expect(mockedDb.select).toHaveBeenCalledTimes(3);
      expect(mockedDb.select.mock.calls[0][0]).toContainEqual(expect.objectContaining({ id: "pkg-1" }));
    });

    it("should return a package with an empty events list if no events are linked", async () => {
      // Mock the package fetch
      mockedDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockPackage]), // First select: package
      } as any).mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]), // Second select: package events (empty)
      } as any);

      const result = await callProcedure("get", input, ctx);

      expect(result).toEqual({ ...mockPackage, events: [] });
      expect(mockedDb.select).toHaveBeenCalledTimes(2); // No third select for events
    });

    it("should throw a TRPCError if the package is not found (Edge Case)", async () => {
      // Mock the package fetch to return empty array
      mockedDb.select.mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      } as any);

      await expect(
        callProcedure("get", input, ctx)
      ).rejects.toThrow("Package not found");
    });

    it("should throw a Zod error for invalid input (Validation)", async () => {
      const invalidInput = { id: 123 }; // id should be a string

      await expect(
        callProcedure("get", invalidInput, ctx)
      ).rejects.toThrow(TRPCError);
    });
  });

  // =========================================================================
  // 2. CREATE Operation
  // =========================================================================

  describe("create", () => {
    const ctx = createMockContext(true);
    const input = {
      title: "New Package",
      description: "A description",
      price: 99.99,
      eventIds: ["evt-a", "evt-b"],
      imageUrl: "http://image.url",
    };

    it("should successfully create a package and link events (CRUD)", async () => {
      // Mock the insert operations
      mockedDb.insert.mockReturnValue({
        values: vi.fn().mockReturnThis(),
        // Mock the execute() or returning() part of the insert chain
        // Since the router uses await db.insert().values() without a final method,
        // we mock the insert call itself to return a chainable object.
        // In the actual implementation, it's just `await db.insert().values(...)`
        // which returns a promise that resolves to an array of inserted rows (or similar).
        // We'll mock the final result to be an empty promise resolution for simplicity.
        values: vi.fn().mockResolvedValue({}),
      } as any);
      
      const result = await callProcedure("create", input, ctx);

      expect(result).toHaveProperty("id");
      expect(result.id).toMatch(/^pkg_\d+$/);
      
      // Expect one insert for the package and two for packageEvents
      expect(mockedDb.insert).toHaveBeenCalledTimes(3); 
      
      // Check package insert call
      const packageInsertCall = mockedDb.insert.mock.calls[0][0];
      expect(packageInsertCall).toEqual(expect.objectContaining({
        title: input.title,
        userId: ctx.user.id,
        price: input.price.toString(),
        imageUrl: input.imageUrl,
      }));

      // Check event insert calls
      const eventInsertCall1 = mockedDb.insert.mock.calls[1][0];
      expect(eventInsertCall1).toEqual(expect.objectContaining({
        packageId: result.id,
        eventId: input.eventIds[0],
        orderIndex: 0,
      }));
      const eventInsertCall2 = mockedDb.insert.mock.calls[2][0];
      expect(eventInsertCall2).toEqual(expect.objectContaining({
        packageId: result.id,
        eventId: input.eventIds[1],
        orderIndex: 1,
      }));
    });

    it("should handle optional fields and null values correctly (Edge Case)", async () => {
      const minimalInput = {
        title: "Minimal Package",
        price: 10.0,
        eventIds: [], // Empty array of events
      };
      
      mockedDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      } as any);

      const result = await callProcedure("create", minimalInput, ctx);

      expect(result).toHaveProperty("id");
      
      // Expect one insert for the package and zero for packageEvents
      expect(mockedDb.insert).toHaveBeenCalledTimes(1); 
      
      // Check package insert call for null/undefined fields
      const packageInsertCall = mockedDb.insert.mock.calls[0][0];
      expect(packageInsertCall).toEqual(expect.objectContaining({
        title: minimalInput.title,
        description: null, // description is optional, should be null in DB
        imageUrl: null, // imageUrl is optional, should be null in DB
      }));
    });

    it("should throw an error if the user is not authenticated (Authentication)", async () => {
      const unauthCtx = createMockContext(false);
      
      await expect(
        callProcedure("create", input, unauthCtx)
      ).rejects.toThrow(TRPCError);
    });

    it("should throw a Zod error for invalid input (Validation)", async () => {
      const invalidInput = { ...input, price: "not-a-number" }; // price should be a number
      
      await expect(
        callProcedure("create", invalidInput, ctx)
      ).rejects.toThrow(TRPCError);
    });
  });

  // =========================================================================
  // 3. UPDATE Operation
  // =========================================================================

  describe("update", () => {
    const ctx = createMockContext(true);
    const baseInput = { id: mockPackage.id };

    it("should successfully update package details (CRUD)", async () => {
      const updateInput = { ...baseInput, title: "Updated Title", isActive: false };
      
      // Mock the update operation
      mockedDb.update.mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      } as any);
      
      const result = await callProcedure("update", updateInput, ctx);

      expect(result).toEqual({ success: true });
      expect(mockedDb.update).toHaveBeenCalledTimes(1);
      
      // Check update call
      const updateCall = mockedDb.update.mock.calls[0][0];
      const setCall = mockedDb.update.mock.calls[0][0].set.mock.calls[0][0];
      
      expect(setCall).toEqual(expect.objectContaining({
        title: updateInput.title,
        isActive: updateInput.isActive,
      }));
      expect(setCall).not.toHaveProperty("id"); // ID should not be in the set object

      // Check where clause (mocked to use eq(eventPackages.id, input.id))
      expect(updateCall.set.mock.calls[0][0]).not.toHaveProperty("eventIds");
      expect(mockedDb.delete).not.toHaveBeenCalled();
      expect(mockedDb.insert).not.toHaveBeenCalled();
    });

    it("should successfully update events by deleting and re-inserting (CRUD)", async () => {
      const newEventIds = ["evt-c", "evt-d"];
      const updateInput = { ...baseInput, eventIds: newEventIds };
      
      mockedDb.update.mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      } as any);
      
      mockedDb.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      } as any);
      
      mockedDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      } as any);

      const result = await callProcedure("update", updateInput, ctx);

      expect(result).toEqual({ success: true });
      expect(mockedDb.update).toHaveBeenCalledTimes(1); // For package update (even if no fields changed)
      expect(mockedDb.delete).toHaveBeenCalledTimes(1); // For deleting old packageEvents
      expect(mockedDb.insert).toHaveBeenCalledTimes(2); // For inserting new packageEvents

      // Check delete call (mocked to use eq(packageEvents.packageId, input.id))
      expect(mockedDb.delete.mock.calls[0][0]).not.toHaveProperty("eventIds");

      // Check insert calls
      const insertCall1 = mockedDb.insert.mock.calls[0][0];
      const insertCall2 = mockedDb.insert.mock.calls[1][0];
      
      expect(insertCall1).toEqual(expect.objectContaining({
        packageId: updateInput.id,
        eventId: newEventIds[0],
      }));
      expect(insertCall2).toEqual(expect.objectContaining({
        packageId: updateInput.id,
        eventId: newEventIds[1],
      }));
    });

    it("should handle setting description to null (Edge Case)", async () => {
      const updateInput = { ...baseInput, description: null };
      
      mockedDb.update.mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      } as any);
      
      await callProcedure("update", updateInput, ctx);

      const setCall = mockedDb.update.mock.calls[0][0].set.mock.calls[0][0];
      expect(setCall).toEqual(expect.objectContaining({
        description: null,
      }));
    });

    it("should throw an error if the user is not authenticated (Authentication)", async () => {
      const unauthCtx = createMockContext(false);
      const updateInput = { ...baseInput, title: "Title" };
      
      await expect(
        callProcedure("update", updateInput, unauthCtx)
      ).rejects.toThrow(TRPCError);
    });

    it("should throw a Zod error for invalid input (Validation)", async () => {
      const invalidInput = { ...baseInput, price: "not-a-number" };
      
      await expect(
        callProcedure("update", invalidInput, ctx)
      ).rejects.toThrow(TRPCError);
    });
  });

  // =========================================================================
  // 4. DELETE Operation
  // =========================================================================

  describe("delete", () => {
    const ctx = createMockContext(true);
    const input = { id: mockPackage.id };

    it("should successfully delete a package and its associated events (CRUD)", async () => {
      mockedDb.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      } as any);

      const result = await callProcedure("delete", input, ctx);

      expect(result).toEqual({ success: true });
      expect(mockedDb.delete).toHaveBeenCalledTimes(2);
      
      // The router deletes packageEvents first, then eventPackages
      // We can't check the exact table names directly with this mock setup, 
      // but we can check the number of calls.
    });

    it("should throw an error if the user is not authenticated (Authentication)", async () => {
      const unauthCtx = createMockContext(false);
      
      await expect(
        callProcedure("delete", input, unauthCtx)
      ).rejects.toThrow(TRPCError);
    });
  });

  // =========================================================================
  // 5. PURCHASE Operation
  // =========================================================================

  describe("purchase", () => {
    const ctx = createMockContext(true);
    const input = {
      packageId: mockPackage.id,
      amount: 100.0,
      stripePaymentId: "pi_12345",
    };

    it("should successfully record a package purchase (CRUD/Mutation)", async () => {
      mockedDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      } as any);
      
      const result = await callProcedure("purchase", input, ctx);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("qrCode");
      expect(result.id).toMatch(/^pkgpur_\d+$/);
      expect(result.qrCode).toMatch(/^PKG-pkgpur_\d+-user-123$/);
      
      expect(mockedDb.insert).toHaveBeenCalledTimes(1);
      
      const insertCall = mockedDb.insert.mock.calls[0][0];
      expect(insertCall).toEqual(expect.objectContaining({
        packageId: input.packageId,
        userId: ctx.user.id,
        amount: input.amount.toString(),
        stripePaymentId: input.stripePaymentId,
        status: "completed",
      }));
    });

    it("should handle missing optional stripePaymentId (Edge Case)", async () => {
      const minimalInput = { ...input, stripePaymentId: undefined };
      
      mockedDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      } as any);

      const result = await callProcedure("purchase", minimalInput, ctx);

      expect(result).toHaveProperty("id");
      
      const insertCall = mockedDb.insert.mock.calls[0][0];
      expect(insertCall).toEqual(expect.objectContaining({
        stripePaymentId: null, // Should be null in DB
      }));
    });

    it("should throw an error if the user is not authenticated (Authentication)", async () => {
      const unauthCtx = createMockContext(false);
      
      await expect(
        callProcedure("purchase", input, unauthCtx)
      ).rejects.toThrow(TRPCError);
    });

    it("should throw a Zod error for invalid input (Validation)", async () => {
      const invalidInput = { ...input, amount: "not-a-number" };
      
      await expect(
        callProcedure("purchase", invalidInput, ctx)
      ).rejects.toThrow(TRPCError);
    });
  });

  // =========================================================================
  // 6. MY PURCHASES Operation
  // =========================================================================

  describe("myPurchases", () => {
    const ctx = createMockContext(true);
    const mockPurchase = {
      id: "pkgpur-1",
      packageId: "pkg-1",
      userId: ctx.user.id,
      amount: "100.00",
      purchasedAt: new Date(),
    };

    it("should return a list of the user's purchases (CRUD/Query)", async () => {
      const mockResult = [mockPurchase];
      
      mockedDb.select.mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await callProcedure("myPurchases", undefined, ctx);

      expect(result).toEqual(mockResult);
      expect(mockedDb.select).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if the user has no purchases (Edge Case)", async () => {
      const mockResult: any[] = [];
      
      mockedDb.select.mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await callProcedure("myPurchases", undefined, ctx);

      expect(result).toEqual([]);
    });

    it("should throw an error if the user is not authenticated (Authentication)", async () => {
      const unauthCtx = createMockContext(false);
      
      await expect(
        callProcedure("myPurchases", undefined, unauthCtx)
      ).rejects.toThrow(TRPCError);
    });
  });
});

