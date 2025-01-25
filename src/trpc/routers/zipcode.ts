import {createTRPCRouter, protectedProcedure} from "@/trpc/trpc";
import {z} from "zod";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {zipCodes} from "@/db/schema";
import {TRPCError} from "@trpc/server";
import {inngest} from "@/inngest/client";

export const zipcodeRouter = createTRPCRouter({
  manualScan: protectedProcedure
    .input(z.object({zipCodeId: z.string().min(5)}))
    .mutation(async ({ctx, input}) => {
      if (!ctx.authObject.userId) {
        throw new Error('Not authed')
      }

      const zipCode = await db.query.zipCodes.findFirst({where: eq(zipCodes.id, input.zipCodeId)})
      if (!zipCode) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }

      if (zipCode.lastScannedAt) {
        if (zipCode.lastScannedAt > new Date(Date.now() - 15 * 60 * 1000)) {
          throw new TRPCError({code: 'BAD_REQUEST', message: 'Zip code has been scanned within the last 15 minutes'})
        }
      }

      await inngest.send({name: 'zipcode/new-subscription-scan', data: {zipCodeId: input.zipCodeId, userId: ctx.authObject.userId}})

      return {message: 'Zip code scan started'}
    }),
});
