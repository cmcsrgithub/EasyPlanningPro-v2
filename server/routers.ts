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
});

export type AppRouter = typeof appRouter;
