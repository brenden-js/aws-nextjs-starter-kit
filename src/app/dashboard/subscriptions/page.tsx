"use client"
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {api} from "@/trpc/react";
import PremiumAccountButton from "../components/premium-account-button";

export default function Component() {
  const apiLimits = api.user.getSubscription.useQuery()
  return (
    <div className="hidden h-full flex-col md:flex">
      <div
        className="ml-3 flex space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Subscriptions and Quotas</h2>
      </div>
      <Separator />
      <div className={"grid-cols-3 grid px-8 my-8 gap-4"}>
        <Card className={"col-span-2 lg:col-span-1"}>
          <CardHeader>
            <CardTitle>
              Current Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"flex justify-between items-center"}>
              <span>Houses Gathered</span>
              {apiLimits.data && (
                <span
                  className={""}>{apiLimits.data.housesUsage} / {apiLimits.data.housesQuota}</span>
              )}
              {apiLimits.isLoading && (
                <div className={"flex"}>
                  <div className={"animate-pulse bg-gray-300 rounded-md w-4 h-4"} />
                  <div className={"mx-1"}>
                    /
                  </div>
                  <span className={"animate-pulse bg-gray-300 rounded-md w-4 h-4"} />
                </div>
              )}
            </div>
            <div className={"flex justify-between mb-4"}>
              <span>Text Generations</span>
              {apiLimits.data && (
                <span
                  className={"text-semibold"}>{apiLimits.data.textUsage} / {apiLimits.data.textQuota}</span>
              )}
              {apiLimits.isLoading && (
                <div className={"flex"}>
                  <div className={"animate-pulse bg-gray-300 rounded-md w-4 h-4"} />
                  <div className={"mx-1"}>
                    /
                  </div>
                  <span className={"animate-pulse bg-gray-300 rounded-md w-4 h-4"} />
                </div>
              )}
            </div>
            <PremiumAccountButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

