import {z} from "zod";

import {and, eq} from "drizzle-orm";
import {stripe} from "@/lib/stripe";
import {absoluteUrl} from "@/lib/utils";
import {TRPCError} from "@trpc/server";
import {v4 as uuidv4} from "uuid";
import {createTRPCRouter, protectedProcedure, publicProcedure} from "@/trpc/trpc";
import {clerkClient} from "@clerk/nextjs/server";
import {prompts, userApiLimits, waitlist} from "@/db/schema";
import {db} from "@/db";
import {getOrCreateApiLimits} from "@/trpc/routers/helpers/api-restrictions";


export const userRouter = createTRPCRouter({
  joinWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        state: z.string().length(2).toUpperCase(),
        wantsUpdates: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
  try {
    await db.insert(waitlist).values({
      email: input.email,
      state: input.state,
      wantsUpdates: input.wantsUpdates,
      createdAt: new Date()
    });

    console.log('Successfully joined waitlist:', input);

    return {
      success: true,
      message: `Successfully added ${input.email} from ${input.state} to the waitlist. ${input.wantsUpdates ? 'Will receive updates.' : 'Opted out of updates.'}`,
    };
  } catch (error) {
    console.error('Error joining waitlist:', error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed: waitlist.email')) {
        throw new Error('This email is already on the waitlist.');
      }
    }

    // Generic error message for other types of errors
    throw new Error('An error occurred while joining the waitlist. Please try again later.');
  }
}),
  addPreference: protectedProcedure
      .input(z.object({name: z.string().min(1), preference: z.string()}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new Error("Not authed")
        }
        const id = uuidv4()
        await ctx.db.insert(prompts).values({
          promptId: id,
          userId: ctx.authObject.userId,
          name: input.name,
          prompt: input.preference
        });
        return id
      }),
  deletePreference: protectedProcedure
      .input(z.string().min(12))
      .mutation(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new Error('Not authed')
        }
        await ctx.db.delete(prompts).where(and(eq(prompts.userId, ctx.authObject.userId), eq(prompts.promptId, input)))
      }),
    addPrompt: protectedProcedure
        .input(z.object({name: z.string().min(1), prompt: z.string()}))
        .mutation(async ({ctx, input}) => {
            if (!ctx.authObject.userId) {
                throw new Error("Not authed")
            }
            const id = uuidv4()
            await ctx.db.insert(prompts).values({
                promptId: id,
                userId: ctx.authObject.userId,
                name: input.name,
                prompt: input.prompt
            });
            return id
        }),
    deletePrompt: protectedProcedure
        .input(z.string().min(12))
        .mutation(async ({ctx, input}) => {
            if (!ctx.authObject.userId) {
                throw new Error('Not authed')
            }
            await ctx.db.delete(prompts).where(and(eq(prompts.userId, ctx.authObject.userId), eq(prompts.promptId, input)))
        }),
    getPrompts: protectedProcedure
        .query(async ({ctx}) => {
            if (!ctx.authObject.userId) {
                throw new Error('Not authed')
            }
            const data = await ctx.db.query.prompts.findMany({where: eq(prompts.userId, ctx.authObject.userId)})
            if (!data) {
                return []
            } else {
                return data
            }
        }),
    getSubscription: protectedProcedure
        .query(async ({ctx}) => {
            if (!ctx.authObject.userId) {
                throw new Error('Not authed')
            }

            const apiLimits = await getOrCreateApiLimits(ctx.authObject.userId)
            const now = new Date();
            const gracePeriod = 24 * 60 * 60 * 1000;
            if (apiLimits.stripeCurrentPeriodEnd && apiLimits.stripeCurrentPeriodEnd > new Date(now.getTime() - gracePeriod)) {
                return {isPremium: true, ...apiLimits}
            } else {
                return {isPremium: false, ...apiLimits}
            }
        }),
    getStripeSession: protectedProcedure
        .mutation(async ({ctx}) => {
            if (!ctx.authObject.userId) {
                throw new Error('Not authed')
            }
            const settingsUrl = absoluteUrl("/dashboard/subscriptions");
            const userSubscription = await db.query.userApiLimits.findFirst({
                where: eq(userApiLimits.userId, ctx.authObject.userId)
            })

            // if there exists a subscription, send to stripe management dashboard
            if (userSubscription?.stripeCustomerId) {
                const stripeSession = await stripe.billingPortal.sessions.create({
                    customer: userSubscription.stripeCustomerId,
                    return_url: settingsUrl,
                })

                return {url: stripeSession.url}
            }

            // send to stripe to purchase subscription
            const user = await clerkClient.users.getUser(ctx.authObject.userId);
            if (!user) {
                throw new TRPCError({code: "UNAUTHORIZED"})
            } else {
                const stripeSession = await stripe.checkout.sessions.create({
                    success_url: settingsUrl,
                    cancel_url: settingsUrl,
                    payment_method_types: ["card"],
                    mode: "subscription",
                    billing_address_collection: "auto",
                    customer_email: user.emailAddresses[0]!.emailAddress,
                    line_items: [
                        {
                            price_data: {
                                currency: "USD",
                                product_data: {
                                    name: "Listing Lab Pro",
                                    description: "Subscribe to new listings in given zip code with full chat access" +
                                      " and" +
                                      " data gathering on all listings."
                                },
                                unit_amount: 10000,
                                recurring: {
                                    interval: "month"
                                }
                            },
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        userId: ctx.authObject.userId,
                    },
                });

                return {url: stripeSession.url}
            }
        })
});
