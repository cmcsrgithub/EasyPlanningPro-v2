import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { randomBytes } from "crypto";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  branch: z.string().optional(),
  interests: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

export const membersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserMembers(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getMember(input.id);
    }),

  create: protectedProcedure
    .input(memberSchema)
    .mutation(async ({ ctx, input }) => {
      const member = {
        id: randomBytes(16).toString("hex"),
        userId: ctx.user.id,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await db.createMember(member);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: memberSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateMember(input.id, { ...input.data, updatedAt: new Date() });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteMember(input.id);
      return { success: true };
    }),
});

