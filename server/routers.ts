import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { eventsRouter } from "./routers/events";
import { venuesRouter } from "./routers/venues";
import { rsvpsRouter } from "./routers/rsvps";
import { membersRouter } from "./routers/members";
import { subscriptionsRouter } from "./routers/subscriptions";
import { albumsRouter } from "./routers/albums";
import { pollsRouter } from "./routers/polls";
import { paymentsRouter } from "./routers/payments";
import { organizationsRouter } from "./routers/organizations";
import { tasksRouter } from "./routers/tasks";
import { financialRouter } from "./routers/financial";
import { messagingRouter } from "./routers/messaging";
import { packagesRouter } from "./routers/packages";
import { brandingRouter } from "./routers/branding";
import { customFormsRouter } from "./routers/customForms";
import { sponsorsRouter } from "./routers/sponsors";
import { donationsRouter } from "./routers/donations";
import { activitiesRouter } from "./routers/activities";
import { templatesRouter } from "./routers/templates";
import { waitlistRouter } from "./routers/waitlist";
import { travelRouter } from "./routers/travel";
import { forumRouter } from "./routers/forum";
import { ticketsRouter } from "./routers/tickets";
import { templateCustomizationRouter } from "./routers/templateCustomization";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  events: eventsRouter,
  venues: venuesRouter,
  rsvps: rsvpsRouter,
  members: membersRouter,
  subscriptions: subscriptionsRouter,
  albums: albumsRouter,
  polls: pollsRouter,
  payments: paymentsRouter,
  organizations: organizationsRouter,
  tasks: tasksRouter,
  financial: financialRouter,
  messaging: messagingRouter,
  packages: packagesRouter,
  branding: brandingRouter,
  customForms: customFormsRouter,
  sponsors: sponsorsRouter,
  donations: donationsRouter,
  activities: activitiesRouter,
  templates: templatesRouter,
  waitlist: waitlistRouter,
  travel: travelRouter,
  forum: forumRouter,
  tickets: ticketsRouter,
  templateCustomization: templateCustomizationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
