"use client"
import {Button} from "../../../components/ui/button";
import {LightningBoltIcon} from "@radix-ui/react-icons";
import {useEffect} from "react";
import {api} from "../../../trpc/react";


export default function PremiumAccountButton() {
  const getStripeSesh = api.user.getStripeSession.useMutation()

  useEffect(() => {
    if (getStripeSesh.data?.url) {
      console.log('Redirecting to stripe...', getStripeSesh.data.url)
      window.location.href = getStripeSesh.data.url
    }
  }, [getStripeSesh.data?.url])


  const userSubscription = api.user.getSubscription.useQuery(undefined, { refetchOnWindowFocus: false})

  return (
    <>
      {(userSubscription.isLoading) ? (
        <p
          className="inline-flex items-center justify-center h-9 px-4 py-2 rounded-md text-sm font-medium bg-gray-50">
          Loading
        </p>
      ) : (
        <>
          {userSubscription.data?.isPremium ? (
            <Button variant={"outline"} disabled={getStripeSesh.isPending} onClick={() => getStripeSesh.mutate()}>
              Manage subscription
            </Button>
          ) : (
            <Button disabled={getStripeSesh.isPending} onClick={() => getStripeSesh.mutate()}>
              Upgrade
              <LightningBoltIcon className="w-4 h-4 ml-2 fill-white" />
            </Button>
          )}
        </>
      )}
    </>
  )
}