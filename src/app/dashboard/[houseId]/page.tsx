"use client"
import { ScrollArea } from "../../../components/ui/scroll-area";
import { LiveDataFeed } from "../components/live-data-feed";
import { Button } from "../../../components/ui/button";
import { ChatInterface } from "../components/chat-interface";
import React, { useEffect, useState } from "react";
import { api } from "../../../trpc/react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {Separator} from "../../../components/ui/separator";

const HouseDetailsPage = ({ params }: { params: { houseId: string } }) => {
  const house = api.house.getHouseDetails.useQuery(params.houseId);
  const [showDataView, setShowDataView] = useState(false);

  const utils = api.useUtils();

  const seenMutation = api.house.setSeen.useMutation();

  useEffect(() => {
    if (!house.data) return;
    if (house.data.seen === null || house.data.seen === 0) {
      seenMutation.mutate({ houseId: house.data.id });
      utils.house.getHouses.invalidate();
    }
  }, [house.data]);

  if (!house.data) return <div></div>;

  return (
    <div className="w-full h-full md:max-h-[100vh] flex flex-col">
      <div className="flex items-center p-4">
        <Link href={`/dashboard`} passHref>
          <Button variant="secondary" size="sm" className="mr-2">
            <ArrowLeftIcon className="mr-2" />
            Houses
          </Button>
        </Link>
        <h1 className="text-lg font-bold truncate">
          {`${house.data.stAddress}, ${house.data.city}, ${house.data.state} ${house.data.zipCode}`}
        </h1>
      </div>
      <Separator />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className="w-full md:w-[25%] border-r border-gray-200 px-3 sm:px-4">
          <Accordion
            type="single"
            collapsible
            className="bg-gray-50 px-3 rounded-lg my-0 mt-4 sm:my-4"
            defaultValue={typeof window === 'undefined' ?  "" : window.innerWidth > 768 ? "item-1" : ""}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>House Details</AccordionTrigger>
              <AccordionContent>
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">
                      {house.data.price
                        ? `$${house.data.price.toLocaleString()}`
                        : "Price not available"}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Beds: {house.data.beds || "N/A"}</div>
                      <div>Baths: {house.data.baths || "N/A"}</div>
                      <div>
                        Sqft: {house.data.sqft?.toLocaleString() || "N/A"}
                      </div>
                      <div>
                        Year Built: {house.data.yearBuilt || "N/A"}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Address:</strong>{" "}
                        {house.data.stAddress}, {house.data.city},{" "}
                        {house.data.state} {house.data.zipCode}
                      </p>
                      <p>
                        <strong>Lot Size:</strong>{" "}
                        {house.data.lotSqft
                          ? `${house.data.lotSqft.toLocaleString()} sqft`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Price per Sqft:</strong>{" "}
                        {house.data.pricePerSqft
                          ? `$${house.data.pricePerSqft}`
                          : "N/A"}
                      </p>
                    </div>
                    {house.data && (
                      <LiveDataFeed
                        houseId={house.data.id}
                        house={house.data}
                        isPending={house.isPending}
                      />
                    )}
                  </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full md:w-[75%] flex flex-col flex-grow">
          <ChatInterface
            showDataView={showDataView}
            setShowDataView={setShowDataView}
            house={house.data}
          />
        </div>
      </div>
    </div>
  );
};

export default HouseDetailsPage;