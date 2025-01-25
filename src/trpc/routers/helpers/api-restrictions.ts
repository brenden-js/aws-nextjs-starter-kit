import {eq} from "drizzle-orm";
import {TRPCError} from "@trpc/server";
import {Model} from "@/lib/data/models";
import {db} from "@/db";
import {userApiLimits} from "@/db/schema";

export interface ApiLimits {
    userId: string;
    createdAt: Date;
    housesUsage: number;
    housesQuota: number;
    textUsage: number;
    textQuota: number;
    maxTokens: number;
    periodEnd: Date;
    stripeCurrentPeriodEnd?: Date | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
}

export const getOrCreateApiLimits = async (userId: string) => {
    const apiLimits = await db.query.userApiLimits.findFirst({where: eq(userApiLimits.userId, userId)});


    // if the api limits are not found, create them
    if (!apiLimits) {
        const newApiLimits = {
            userId,
            createdAt: new Date(),
            housesUsage: 0,
            housesQuota: 3,
            textUsage: 0,
            textQuota: 3,
            maxTokens: 750,
            periodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            zipCodesLimit: 0,
            zipCodesUsage: 0
        };
        await db.insert(userApiLimits).values(newApiLimits);
        return newApiLimits;
    }

    const now = new Date();

    const gracePeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // check if the stripe subscription is valid, if so, return the api limits
    if (apiLimits.stripeCurrentPeriodEnd && apiLimits.stripeCurrentPeriodEnd > new Date(now.getTime() - gracePeriod)) {
        // return the api limits
        return apiLimits;
    }

    // check if the api limits are expired, if so, update them to 30 days from now and reset the usage

    if (apiLimits.periodEnd < new Date()) {
        // update the api limits to 30 days from now and reset the usage
        await db.update(userApiLimits).set({
            periodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            housesUsage: 0,
            textUsage: 0,
            maxTokens: 750
        }).where(eq(userApiLimits.userId, userId))
        return {
            userId,
            createdAt: new Date(),
            housesUsage: 0,
            housesQuota: 3,
            textUsage: 0,
            textQuota: 3,
            maxTokens: 750,
            periodEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            stripeCurrentPeriodEnd: null,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            zipCodesLimit: 0,
            zipCodesUsage: 0
        };
    }

    return apiLimits
};


export const getMaxTokens = (apiLimits: ApiLimits, requestedMaxTokens: number) => {
    if (requestedMaxTokens > apiLimits.maxTokens) {
        return apiLimits.maxTokens;
    }
    return requestedMaxTokens;
};

export const getSelectedModel = (selectedModelId: string, models: Model[], apiLimits: ApiLimits) => {
    const selectedModel = models.find(model => model.id === selectedModelId);

    if (!selectedModel) {
        throw new TRPCError({message: "Invalid model selection.", code: "BAD_REQUEST"});
    }

    if (selectedModel.pro && (apiLimits.stripeCurrentPeriodEnd && apiLimits.stripeCurrentPeriodEnd < new Date()) || (apiLimits.stripeCurrentPeriodEnd === null)) {
        throw new TRPCError({
            message: "Your current subscription does not allow for the use of Pro models.",
            code: "UNAUTHORIZED"
        });
    }

    return selectedModel;
};