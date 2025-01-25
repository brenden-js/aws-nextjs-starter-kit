import React, {useEffect, useState} from "react";
import {api} from "../../../trpc/react";
import {toast} from "sonner";
import {Input} from "../../../components/ui/input";
import {Button} from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {ScrollArea} from "../../../components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {Loader, SearchIcon} from "lucide-react";

export const AddZipCodeDialog = ({open, onOpenChange}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [zipCode, setZipCode] = useState("");
  const addZipCode = api.house.setUserZipCode.useMutation();
  const zipCodes = api.house.getUserZipCodes.useQuery();
  const searchZipCode = api.house.searchZipCode.useMutation();
  const apiLimits = api.user.getSubscription.useQuery();

  useEffect(() => {
    if (addZipCode.isError) {
      toast.error(addZipCode.error.message);
    }
  }, [addZipCode.isError]);

  useEffect(() => {
    if (searchZipCode.isError) {
      toast.error(searchZipCode.error.message);
    }
  }, [searchZipCode.isError]);

  const handleAddZipCode = async () => {
    if (searchZipCode.isSuccess && searchZipCode.data) {
      const {city, state, id} = searchZipCode.data;
      const result = await addZipCode.mutateAsync({zipCode: id, city, state});
      if (result.status === "Zip code added successfully") {
        toast.success("Zip code added successfully");
        setZipCode("");
        searchZipCode.reset();
        onOpenChange(false);
        zipCodes.refetch();
      }
    }
  };

  const handleSearchZipCode = async (event: React.FormEvent) => {
    event.preventDefault();
    await searchZipCode.mutateAsync({zipCode});
  };

  const handleResetSearch = () => {
    setZipCode("");
    searchZipCode.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Zip Codes</DialogTitle>
          <DialogDescription>
            {apiLimits.isLoading && <div>Loading...</div>}
            {!apiLimits.isLoading && apiLimits.data?.zipCodesLimit === null && (
              <div>
                You have no zip codes available, go to subscriptions to increase
                your limit.
              </div>
            )}
            {!apiLimits.isLoading &&
              apiLimits.data?.zipCodesLimit !== null &&
              apiLimits.data !== undefined && (
                <>
                  <div>
                    {apiLimits.data.zipCodesUsage} /{" "}
                    {apiLimits.data.zipCodesLimit} zip code subscriptions used.
                  </div>
                  {apiLimits.data?.zipCodesLimit === 0 && (
                    <div>
                      You have no zip codes available, go to subscriptions to
                      increase your limit.
                    </div>
                  )}
                </>
              )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-4 p-4">
              <form className="flex gap-1 max-w-sm mx-auto" onSubmit={handleSearchZipCode}>
                <Input
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  disabled={searchZipCode.isPending || searchZipCode.isSuccess}
                  className="flex-grow" // Allow Input to grow and take available space
                />
                {!searchZipCode.isPending && searchZipCode.isSuccess && (
                  <Button variant="secondary" className="min-w-[200px]" onClick={handleResetSearch}>
                    Try Another Zip
                    <SearchIcon
                      className="ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Button>
                )}
                {searchZipCode.isPending || !searchZipCode.isSuccess && (
                  <Button
                    className="ml-3 min-w-[200px]"
                    variant="default"
                    onClick={handleSearchZipCode}
                    disabled={searchZipCode.isPending}
                    type="submit"
                  >
                    Search Zip Code
                    <SearchIcon
                      className="ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </form>
              {searchZipCode.isPending && <div className={"text-center mx-auto"}>Searching...</div>}
              {searchZipCode.isSuccess && searchZipCode.data && (
                <>
                  <h4 className={"text-center mx-auto"}>Found zip code:</h4>
                  <div
                    className="max-w-sm mx-auto p-4 flex justify-between rounded-lg border border-gray-300"
                  >
                    <div>
                      <div className="font-medium">{searchZipCode.data.id}</div>
                      <div className="text-sm text-gray-600">
                        {searchZipCode.data.city}, {searchZipCode.data.state}
                      </div>
                    </div>
                    <Button
                      disabled={addZipCode.isPending}
                      variant="default"
                      onClick={handleAddZipCode}
                    >
                      Subscribe
                    </Button>
                  </div>
                </>
              )}
              {zipCodes.isPending && <div>Loading...</div>}
              {!zipCodes.isPending &&
                zipCodes.isSuccess &&
                zipCodes.data.length === 0 && (
                  <div className="text-gray-800 text-center">
                    You are not subscribed to any zip codes.
                  </div>
                )}
              {!zipCodes.isPending &&
                zipCodes.isSuccess &&
                zipCodes.data.length > 0 && (
                  <div className="flex flex-wrap">
                    {zipCodes.data.map((zipCodeData) => (
                      <div className="w-full mb-4" key={zipCodeData.id}>
                        <ZipCodeCard zipCode={zipCodeData}/>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ZipCodeCardProps {
  zipCode: { id: string; city: string; state: string };
}

const ZipCodeCard: React.FC<ZipCodeCardProps> = ({zipCode}) => {
  const utils = api.useUtils();

  const handleUnsubscribeZipCode = api.house.unsubscribeZipCode.useMutation({
    onSuccess: () => {
      toast.success("Zip code unsubscribed successfully");
      utils.house.getUserZipCodes.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleScanZipCode = api.zipcode.manualScan.useMutation({
    onSuccess: () => {
      toast.success("Zip code scan started successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{zipCode.id}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {zipCode.city}, {zipCode.state}
        </CardDescription>
        <div className="flex justify-between">
          {/* Add flex and justify-end */}
          <Button
            variant="suttleDestructive"
            disabled={handleUnsubscribeZipCode.isPending}
            onClick={() =>
              handleUnsubscribeZipCode.mutate({zipCodeId: zipCode.id})
            }
          >
            {handleUnsubscribeZipCode.isPending
              ? "Unsubscribing..."
              : "Unsubscribe"}
            {handleUnsubscribeZipCode.isPending && (
              <Loader className="ml-2 h-4 w-4 animate-spin"/>
            )}
          </Button>
          <Button
            variant={"outline"}
            onClick={() => handleScanZipCode.mutate({zipCodeId: zipCode.id})}
          >
            Scan zip code
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};