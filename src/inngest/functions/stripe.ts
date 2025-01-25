import {eq} from "drizzle-orm";
import {inngest} from "@/inngest/client";
import {userApiLimits} from "@/db/schema";
import {db} from "@/db";
import {stripe} from "@/lib/stripe";

export const handleSubscriptionPurchased = inngest.createFunction(
    {id: 'stripe-checkout-session-completed'},
    {event: 'payments/checkout-session-completed'},
    async ({event, step}) => {

        if (!event.data.subscription) {
            throw new Error('No subscription data was found')
        }

        if (typeof event.data.subscription !== "string") {
            throw new Error('An error happened when handling a checkout session completed event. The subscription type is not a string.')
        }

        const subscription = await stripe.subscriptions.retrieve(event.data.subscription)

        if (!event.data.metadata?.userId) {
            throw new Error('No userId was found in metadata')
        }
        const end = subscription.current_period_end * 1000
        await db.update(userApiLimits).set({
            userId: event.data.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0]!.price.id,
            stripeCurrentPeriodEnd: new Date(end),
            periodEnd: new Date(end),
            housesQuota: 25,
            textQuota: 125,
            maxTokens: 4000,
            zipCodesLimit: 3,
            zipCodesUsage: 0
        }).where(eq(userApiLimits.userId, event.data.metadata.userId))

        return {userId: event.data.metadata.userId, periodEnd: end, subId: subscription.id}
    }
)