import { describe, it, expect, vi, beforeEach } from "vitest";
import { tasksRouter } from "../tasks";
import { TRPCError } from "@trpc/server";
import { tasks } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

// Mock Drizzle ORM chainable query execution
const mockExecute = vi.fn();
const createMockQuery = () => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  // Make the query object awaitable (Drizzle ORM queries are thenable)
  then: (resolve: (value: any) => void) => resolve(mockExecute()),
});

const mockDb = {
  select: vi.fn(createMockQuery),
  insert: vi.fn(createMockQuery),
  update: vi.fn(createMockQuery),
  delete: vi.fn(createMockQuery),
  execute: mockExecute,
};

// Mock the getDb function to return the mocked database object
vi.mock("../../db", () => ({
  getDb: vi.fn().mockImplementation(() => mockDb),
}));

// Mock randomBytes for predictable task IDs
vi.mock("crypto", () => ({
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue("mockedtaskid"),
  }),
}));

// Mock the tRPC caller/context
const mockUser = { id: "user-123", role: "user" as const };
const mockContext = {
  user: mockUser,
  req: {} as any,
  res: {} as any,
};

const createCaller = (ctx: any) => {
  return tasksRouter.createCaller(ctx);
};

// Sample data
const sampleTask = {
  id: "task-1",
  eventId: "event-1",
  userId: mockUser.id,
  title: "Buy decorations",
  description: "Get balloons and streamers",
  status: "todo",
  priority: "high",
  assignedTo: "user-456",
  dueDate: new Date("2025-12-31"),
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("tasksRouter", () => {
  let caller: ReturnType<typeof createCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    caller = createCaller(mockContext);
    // Reset the mockExecute to resolve with a default value for most tests
    mockExecute.mockResolvedValue([]);
  });

  // --- Authentication/Authorization Tests (Protected Procedures) ---
  describe("Authentication", () => {
    it("should throw UNAUTHORIZED error if user is not authenticated for a protected procedure", async () => {
      const unauthedCaller = createCaller({ user: null });
      const input = { eventId: "event-1" };

      await expect(unauthedCaller.listByEvent(input)).rejects.toThrow(
        new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" })
      );
    });
  });

  // --- CRUD Operations Tests ---

  describe("create", () => {
    const validInput = {
      eventId: "event-1",
      title: "New Task",
      dueDate: new Date("2026-01-01"),
    };

    it("should successfully create a new task", async () => {
      mockExecute.mockResolvedValueOnce([{ insertId: 1 }]); // Mock for insert result

      const result = await caller.create(validInput);

      expect(result).toEqual({ success: true, taskId: "task_mockedtaskid" });
      expect(mockDb.insert).toHaveBeenCalledWith(tasks);
      expect(mockDb.insert).toHaveReturnedWith(
        expect.objectContaining({ values: expect.any(Function) })
      );
      // Check the values passed to the insert query
      const valuesMock = mockDb.insert.mock.results[0].value.values;
      expect(valuesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("task_mockedtaskid"),
          userId: mockUser.id,
          eventId: validInput.eventId,
          title: validInput.title,
          status: "todo", // default value
          priority: "medium", // default value
          dueDate: validInput.dueDate,
        })
      );
    });

    // --- Input Validation (Zod schemas) ---
    it("should throw a BAD_REQUEST error for invalid input (missing title)", async () => {
      const invalidInput = { eventId: "event-1", title: "" };

      await expect(caller.create(invalidInput as any)).rejects.toThrow(
        TRPCError
      );
      await expect(caller.create(invalidInput as any)).rejects.toHaveProperty(
        "code",
        "BAD_REQUEST"
      );
    });

    // --- Error Handling ---
    it("should throw INTERNAL_SERVER_ERROR if database is not available", async () => {
      // Import getDb to mock its implementation for this test
      const { getDb } = await import("../../db");
      // Temporarily mock getDb to return null
      (getDb as any).mockResolvedValueOnce(null);

      await expect(caller.create(validInput)).rejects.toThrow(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        })
      );
    });
  });

  describe("listByEvent", () => {
    it("should return a list of tasks for a given eventId", async () => {
      const mockTasks = [sampleTask, { ...sampleTask, id: "task-2" }];
      mockExecute.mockResolvedValue(mockTasks);

      const result = await caller.listByEvent({ eventId: "event-1" });

      expect(result).toEqual(mockTasks);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.select).toHaveReturnedWith(
        expect.objectContaining({ from: expect.any(Function) })
      );
      // Check the where clause
      const whereMock = mockDb.select.mock.results[0].value.where;
      expect(whereMock).toHaveBeenCalledWith(eq(tasks.eventId, "event-1"));
    });

    // --- Edge Cases (Empty array) ---
    it("should return an empty array if no tasks are found", async () => {
      mockExecute.mockResolvedValue([]);

      const result = await caller.listByEvent({ eventId: "event-nonexistent" });

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a single task by ID", async () => {
      mockExecute.mockResolvedValue([sampleTask]);

      const result = await caller.getById({ id: "task-1" });

      expect(result).toEqual(sampleTask);
      const whereMock = mockDb.select.mock.results[0].value.where;
      const limitMock = whereMock.mock.results[0].value.limit;
      expect(whereMock).toHaveBeenCalledWith(eq(tasks.id, "task-1"));
      expect(limitMock).toHaveBeenCalledWith(1);
    });

    // --- Edge Cases (Null value) ---
    it("should return null if the task is not found", async () => {
      mockExecute.mockResolvedValue([]);

      const result = await caller.getById({ id: "task-nonexistent" });

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should successfully update a task's title and description", async () => {
      const updateInput = {
        id: "task-1",
        title: "Updated Title",
        description: "Updated Description",
      };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mock for update

      const result = await caller.update(updateInput);

      expect(result).toEqual({ success: true });
      expect(mockDb.update).toHaveBeenCalledWith(tasks);
      const setMock = mockDb.update.mock.results[0].value.set;
      const whereMock = setMock.mock.results[0].value.where;
      expect(setMock).toHaveBeenCalledWith({
        title: "Updated Title",
        description: "Updated Description",
      });
      expect(whereMock).toHaveBeenCalledWith(eq(tasks.id, "task-1"));
    });

    it("should set completedAt when status is updated to 'done'", async () => {
      const updateInput = {
        id: "task-1",
        status: "done" as const,
      };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await caller.update(updateInput);

      const setMock = mockDb.update.mock.results[0].value.set;
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "done",
          completedAt: expect.any(Date),
        })
      );
    });

    it("should not set completedAt when status is updated to 'todo'", async () => {
      const updateInput = {
        id: "task-1",
        status: "todo" as const,
      };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await caller.update(updateInput);

      const setMock = mockDb.update.mock.results[0].value.set;
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "todo",
        })
      );
      expect(setMock).not.toHaveBeenCalledWith(
        expect.objectContaining({
          completedAt: expect.any(Date),
        })
      );
    });

    // --- Input Validation ---
    it("should throw a BAD_REQUEST error for invalid status enum", async () => {
      const invalidInput = { id: "task-1", status: "invalid_status" };

      await expect(caller.update(invalidInput as any)).rejects.toThrow(
        TRPCError
      );
      await expect(caller.update(invalidInput as any)).rejects.toHaveProperty(
        "code",
        "BAD_REQUEST"
      );
    });

    // --- Edge Cases (No fields to update) ---
    it("should succeed when no fields are provided (empty updateData)", async () => {
      const updateInput = { id: "task-1" };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await caller.update(updateInput);

      expect(result).toEqual({ success: true });
      const setMock = mockDb.update.mock.results[0].value.set;
      expect(setMock).toHaveBeenCalledWith({});
    });
  });

  describe("delete", () => {
    it("should successfully delete a task", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mock for delete

      const result = await caller.delete({ id: "task-1" });

      expect(result).toEqual({ success: true });
      expect(mockDb.delete).toHaveBeenCalledWith(tasks);
      const whereMock = mockDb.delete.mock.results[0].value.where;
      expect(whereMock).toHaveBeenCalledWith(eq(tasks.id, "task-1"));
    });

    // --- Edge Cases (Invalid ID/non-existent ID) ---
    it("should succeed even if the task ID does not exist (delete is idempotent)", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await caller.delete({ id: "task-nonexistent" });

      expect(result).toEqual({ success: true });
    });
  });

  describe("updateStatus", () => {
    it("should successfully update a task's status to 'in_progress'", async () => {
      const updateInput = {
        id: "task-1",
        status: "in_progress" as const,
      };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await caller.updateStatus(updateInput);

      expect(result).toEqual({ success: true });
      const setMock = mockDb.update.mock.results[0].value.set;
      expect(setMock).toHaveBeenCalledWith({ status: "in_progress" });
    });

    it("should set completedAt when status is updated to 'done'", async () => {
      const updateInput = {
        id: "task-1",
        status: "done" as const,
      };
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await caller.updateStatus(updateInput);

      const setMock = mockDb.update.mock.results[0].value.set;
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "done",
          completedAt: expect.any(Date),
        })
      );
    });
  });

  describe("getStats", () => {
    // Sample tasks for stats calculation
    // Note: The date is compared to `new Date()` at the time of test execution.
    // Setting dueDate to a past date (e.g., 2024-01-01) ensures it's overdue.
    const taskList = [
      { ...sampleTask, id: "t1", status: "todo", priority: "high", dueDate: new Date("2024-01-01") }, // Overdue, High
      { ...sampleTask, id: "t2", status: "todo", priority: "medium", dueDate: new Date("2050-01-01") }, // Todo
      { ...sampleTask, id: "t3", status: "in_progress", priority: "high", dueDate: new Date("2050-01-01") }, // In Progress, High
      { ...sampleTask, id: "t4", status: "done", priority: "low", dueDate: new Date("2024-01-01") }, // Done (not overdue)
      { ...sampleTask, id: "t5", status: "done", priority: "high", dueDate: new Date("2024-01-01") }, // Done (not overdue)
    ];

    it("should correctly calculate task statistics", async () => {
      mockExecute.mockResolvedValue(taskList);

      const result = await caller.getStats({ eventId: "event-1" });

      expect(result).toEqual({
        total: 5,
        todo: 2, // t1, t2
        inProgress: 1, // t3
        done: 2, // t4, t5
        highPriority: 3, // t1, t3, t5
        overdue: 1, // t1 (dueDate in past AND status !== 'done')
      });
    });

    // --- Edge Cases (Empty array) ---
    it("should return zeroed stats for an event with no tasks", async () => {
      mockExecute.mockResolvedValue([]);

      const result = await caller.getStats({ eventId: "event-nonexistent" });

      expect(result).toEqual({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        highPriority: 0,
        overdue: 0,
      });
    });
  });
});

