import { createTRPCRouter } from "./trpc";
import { cardRouter } from "./routers/card-router";
import { userRouter } from "./routers/user-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  cardRouter: cardRouter,
  userRouter: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
