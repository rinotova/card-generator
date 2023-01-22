import { createTRPCRouter } from "./trpc";
import { cardRouter } from "./routers/card-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  cardRouter: cardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
