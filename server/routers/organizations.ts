import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { organizations, organizationMembers, teamInvitations, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";

const SUBSCRIPTION_LIMITS = {
  basic: 1,
  premium: 2,
  pro: 5,
  business: 10,
  enterprise: 999,
};

export const organizationsRouter = router({
  // Get current user's organization
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const result = await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);

    return result[0] || null;
  }),

  // Create organization
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const orgId = `org_${randomBytes(16).toString("hex")}`;

      await db.insert(organizations).values({
        id: orgId,
        name: input.name,
        ownerId: ctx.user.id,
        subscriptionTier: ctx.user.subscriptionTier || "basic",
      });

      // Add owner as member
      await db.insert(organizationMembers).values({
        id: `orgmem_${randomBytes(16).toString("hex")}`,
        organizationId: orgId,
        userId: ctx.user.id,
        role: "owner",
      });

      return { success: true, organizationId: orgId };
    }),

  // List team members
  listMembers: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    // Get user's organization
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);

    if (!org[0]) {
      return [];
    }

    // Get members with user details
    const members = await db
      .select({
        id: organizationMembers.id,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
        userId: users.id,
        name: users.name,
        email: users.email,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, org[0].id));

    return members;
  }),

  // Invite team member
  inviteAdmin: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["admin", "member"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get user's organization
      const org = await db
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);

      if (!org[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
      }

      // Check subscription limit
      const tier = ctx.user.subscriptionTier || "basic";
      const limit = SUBSCRIPTION_LIMITS[tier];

      const currentMembers = await db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.organizationId, org[0].id));

      if (currentMembers.length >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your ${tier} plan allows up to ${limit} team member(s). Upgrade to add more.`,
        });
      }

      // Check if already invited
      const existing = await db
        .select()
        .from(teamInvitations)
        .where(
          and(
            eq(teamInvitations.organizationId, org[0].id),
            eq(teamInvitations.email, input.email),
            eq(teamInvitations.status, "pending")
          )
        );

      if (existing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already sent" });
      }

      // Create invitation
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      await db.insert(teamInvitations).values({
        id: `inv_${randomBytes(16).toString("hex")}`,
        organizationId: org[0].id,
        email: input.email,
        role: input.role,
        invitedBy: ctx.user.id,
        token,
        expiresAt,
        status: "pending",
      });

      // TODO: Send invitation email
      // await sendInvitationEmail(input.email, token, org[0].name);

      return { success: true, message: "Invitation sent successfully" };
    }),

  // Accept invitation
  acceptInvitation: protectedProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Find invitation
      const invitation = await db
        .select()
        .from(teamInvitations)
        .where(
          and(
            eq(teamInvitations.token, input.token),
            eq(teamInvitations.status, "pending")
          )
        )
        .limit(1);

      if (!invitation[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found or expired" });
      }

      // Check expiry
      if (new Date() > invitation[0].expiresAt) {
        await db
          .update(teamInvitations)
          .set({ status: "expired" })
          .where(eq(teamInvitations.id, invitation[0].id));

        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation has expired" });
      }

      // Add user to organization
      await db.insert(organizationMembers).values({
        id: `orgmem_${randomBytes(16).toString("hex")}`,
        organizationId: invitation[0].organizationId,
        userId: ctx.user.id,
        role: invitation[0].role,
        invitedBy: invitation[0].invitedBy,
      });

      // Mark invitation as accepted
      await db
        .update(teamInvitations)
        .set({ status: "accepted" })
        .where(eq(teamInvitations.id, invitation[0].id));

      return { success: true, message: "Successfully joined team" };
    }),

  // Remove team member
  removeMember: protectedProcedure
    .input(z.object({
      memberId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify ownership
      const member = await db
        .select({
          member: organizationMembers,
          org: organizations,
        })
        .from(organizationMembers)
        .leftJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.id, input.memberId))
        .limit(1);

      if (!member[0] || member[0].org?.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Can't remove owner
      if (member[0].member.role === "owner") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove organization owner" });
      }

      await db
        .delete(organizationMembers)
        .where(eq(organizationMembers.id, input.memberId));

      return { success: true, message: "Member removed successfully" };
    }),

  // List pending invitations
  listInvitations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);

    if (!org[0]) {
      return [];
    }

    const invitations = await db
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations.organizationId, org[0].id),
          eq(teamInvitations.status, "pending")
        )
      );

    return invitations;
  }),
});

