import {createTRPCRouter} from "@/trpc/trpc";
import {houseRouter} from "@/trpc/routers/house";
import {userRouter} from "@/trpc/routers/user";
import {zipcodeRouter} from "@/trpc/routers/zipcode";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  house: houseRouter,
  user: userRouter,
  zipcode: zipcodeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
