import React, {useEffect, useRef, useState} from 'react';
import {CheckCircledIcon, CrossCircledIcon, ReloadIcon} from "@radix-ui/react-icons";
import {api} from "@/trpc/react";
import {Button} from "@/components/ui/button";
import {House} from "@/app/dashboard/contexts/prompts";
import {Loader2} from "lucide-react";

export const LiveDataFeed = ({house, isPending, houseId}: { house: House, isPending: boolean, houseId: string }) => {
  const {refetch} = api.house.getHouseDetails.useQuery(houseId,
    {enabled: false} // Disable initial fetch, we'll control it manually
  );

  const [searching, setSearching] = useState(false);
  const checkCountRef = useRef(0); // Use a ref to persist the count across renders
  const claimHouse = api.house.claimHouse.useMutation({
    onSuccess: async (data) => {
      // Immediately refetch after claiming
      setSearching(true);
      await refetch();
      checkUpdates(); // Start checking for updates
    }
  });

  const checkUpdates = async () => {
    const {data: refetchedHouse} = await refetch();
    checkCountRef.current++;

    if (areAllFieldsPopulated(refetchedHouse) || checkCountRef.current >= 5) {
      setSearching(false);
    } else {
      setTimeout(checkUpdates, 3000);
    }
  };
  const handleClaimHouse = () => {
    if (!house) return
    claimHouse.mutate({houseId: house.id})
  };

  const areAllFieldsPopulated = (houseData: House) => {
    return houseData?.lat !== null &&
      houseData?.nearbyPlaces !== null &&
      houseData?.investment !== null &&
      houseData?.recentlySold !== null;
  };


  if (!house) {
    return <div></div>;
  }

  const getUpdateIcon = (field: keyof typeof house) => {
    if (house[field] !== null) {
      return <CheckCircledIcon className="h-4 w-4"/>;
    } else if (!house.claimed) {
      return <CrossCircledIcon className="h-4 w-4"/>
    } else if (searching) {
      return <ReloadIcon className="animate-spin h-4 w-4"/>
    } else if (!searching && house[field] === null) {
      return <CrossCircledIcon className="h-4 w-4"/>
    }
  };

  return (
    <>
      <Button
        disabled={!!house.claimed || claimHouse.isPending}
        onClick={handleClaimHouse}
        className="relative"
      >
        Get Data
        {claimHouse.isPending && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
        )}
      </Button>
      <div className="flex flex-col">
        <div className="flex text-sm text-muted-foreground">Data aggregated</div>
        <div className="w-full">
          <div className="flex justify-between">
            <p className="text-sm">Property</p>
            <div className="text-sm">
              {getUpdateIcon('lat')}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Location</p>
            <div className="text-sm">
              {getUpdateIcon('nearbyPlaces')}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Financial</p>
            <div className="text-sm">
              {getUpdateIcon('investment')}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Comps</p>
            <div className="text-sm">
              {getUpdateIcon('recentlySold')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};