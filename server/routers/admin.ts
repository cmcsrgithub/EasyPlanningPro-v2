import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { 
  userRoles, 
  permissions, 
  rolePermissions, 
  systemLogs, 
  activityLogs, 
  flaggedContent, 
  moderationActions, 
  systemConfig, 
  performanceMetrics, 
  userSuspensions 
} from "../../drizzle/schema";
import { eq, desc, and, gte, lte, like, sql } from "drizzle-orm";

export const adminRouter = router({
  // ===== USER MANAGEMENT =====
  
  getUsers: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      search: z.string().optional(),
      role: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const offset = (input.page - 1) * input.limit;
      
      // This would query the users table - simplified for now
      return {
        users: [],
        total: 0,
        page: input.page,
        limit: input.limit,
      };
    }),

  assignRole: protectedProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["admin", "moderator", "user", "guest"]),
      expiresAt: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db.insert(userRoles).values({
        userId: input.userId,
        role: input.role,
        assignedBy: ctx.user?.id ? parseInt(ctx.user.id) : undefined,
        expiresAt: input.expiresAt,
      });
      
      return { success: true, id: result.insertId };
    }),

  suspendUser: protectedProcedure
    .input(z.object({
      userId: z.number(),
      reason: z.string(),
      endDate: z.date().optional(),
      isPermanent: z.boolean().default(false),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db.insert(userSuspensions).values({
        userId: input.userId,
        suspendedBy: parseInt(ctx.user?.id!),
        reason: input.reason,
        endDate: input.endDate,
        isPermanent: input.isPermanent,
        notes: input.notes,
      });
      
      return { success: true, id: result.insertId };
    }),

  unsuspendUser: protectedProcedure
    .input(z.object({
      suspensionId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.update(userSuspensions)
        .set({ isActive: false })
        .where(eq(userSuspensions.id, input.suspensionId));
      
      return { success: true };
    }),

  // ===== SYSTEM LOGS =====
  
  getSystemLogs: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(100),
      level: z.enum(["info", "warning", "error", "critical"]).optional(),
      category: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const offset = (input.page - 1) * input.limit;
      
      let conditions = [];
      if (input.level) conditions.push(eq(systemLogs.level, input.level));
      if (input.category) conditions.push(eq(systemLogs.category, input.category));
      if (input.startDate) conditions.push(gte(systemLogs.createdAt, input.startDate));
      if (input.endDate) conditions.push(lte(systemLogs.createdAt, input.endDate));
      
      const logs = await db.select()
        .from(systemLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(systemLogs.createdAt))
        .limit(input.limit)
        .offset(offset);
      
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(systemLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      return {
        logs,
        total: countResult.count,
        page: input.page,
        limit: input.limit,
      };
    }),

  getActivityLogs: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(100),
      userId: z.number().optional(),
      action: z.string().optional(),
      entityType: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const offset = (input.page - 1) * input.limit;
      
      let conditions = [];
      if (input.userId) conditions.push(eq(activityLogs.userId, input.userId));
      if (input.action) conditions.push(eq(activityLogs.action, input.action));
      if (input.entityType) conditions.push(eq(activityLogs.entityType, input.entityType));
      if (input.startDate) conditions.push(gte(activityLogs.createdAt, input.startDate));
      if (input.endDate) conditions.push(lte(activityLogs.createdAt, input.endDate));
      
      const logs = await db.select()
        .from(activityLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(activityLogs.createdAt))
        .limit(input.limit)
        .offset(offset);
      
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(activityLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      return {
        logs,
        total: countResult.count,
        page: input.page,
        limit: input.limit,
      };
    }),

  // ===== CONTENT MODERATION =====
  
  getFlaggedContent: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      status: z.enum(["pending", "reviewed", "approved", "removed"]).optional(),
      contentType: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const offset = (input.page - 1) * input.limit;
      
      let conditions = [];
      if (input.status) conditions.push(eq(flaggedContent.status, input.status));
      if (input.contentType) conditions.push(eq(flaggedContent.contentType, input.contentType));
      
      const content = await db.select()
        .from(flaggedContent)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(flaggedContent.createdAt))
        .limit(input.limit)
        .offset(offset);
      
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(flaggedContent)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      return {
        content,
        total: countResult.count,
        page: input.page,
        limit: input.limit,
      };
    }),

  reviewFlaggedContent: protectedProcedure
    .input(z.object({
      flagId: z.number(),
      action: z.enum(["approve", "remove"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.update(flaggedContent)
        .set({
          status: input.action === "approve" ? "approved" : "removed",
          reviewedBy: ctx.user?.id ? parseInt(ctx.user.id) : undefined,
          reviewedAt: new Date(),
          reviewNotes: input.notes,
        })
        .where(eq(flaggedContent.id, input.flagId));
      
      await db.insert(moderationActions).values({
        moderatorId: parseInt(ctx.user?.id!),
        action: input.action,
        targetType: "content",
        targetId: input.flagId,
        reason: input.notes,
      });
      
      return { success: true };
    }),

  // ===== SYSTEM CONFIGURATION =====
  
  getSystemConfig: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const configs = await db.select()
        .from(systemConfig)
        .where(input.category ? eq(systemConfig.category, input.category) : undefined)
        .orderBy(systemConfig.category, systemConfig.key);
      
      return configs;
    }),

  updateSystemConfig: protectedProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      category: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const existing = await db.select()
        .from(systemConfig)
        .where(eq(systemConfig.key, input.key))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(systemConfig)
          .set({
            value: input.value,
            updatedBy: ctx.user?.id ? parseInt(ctx.user.id) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(systemConfig.key, input.key));
      } else {
        await db.insert(systemConfig).values({
          key: input.key,
          value: input.value,
          category: input.category,
          description: input.description,
          updatedBy: ctx.user?.id ? parseInt(ctx.user.id) : undefined,
        });
      }
      
      return { success: true };
    }),

  // ===== PERFORMANCE METRICS =====
  
  getPerformanceMetrics: protectedProcedure
    .input(z.object({
      metric: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      limit: z.number().default(1000),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      let conditions = [];
      if (input.metric) conditions.push(eq(performanceMetrics.metric, input.metric));
      if (input.startDate) conditions.push(gte(performanceMetrics.createdAt, input.startDate));
      if (input.endDate) conditions.push(lte(performanceMetrics.createdAt, input.endDate));
      
      const metrics = await db.select()
        .from(performanceMetrics)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(performanceMetrics.createdAt))
        .limit(input.limit);
      
      return metrics;
    }),

  getPerformanceStats: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      let conditions = [];
      if (input.startDate) conditions.push(gte(performanceMetrics.createdAt, input.startDate));
      if (input.endDate) conditions.push(lte(performanceMetrics.createdAt, input.endDate));
      
      const stats = await db.select({
        metric: performanceMetrics.metric,
        avgValue: sql<number>`AVG(${performanceMetrics.value})`,
        minValue: sql<number>`MIN(${performanceMetrics.value})`,
        maxValue: sql<number>`MAX(${performanceMetrics.value})`,
        count: sql<number>`COUNT(*)`,
      })
        .from(performanceMetrics)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(performanceMetrics.metric);
      
      return stats;
    }),
});

