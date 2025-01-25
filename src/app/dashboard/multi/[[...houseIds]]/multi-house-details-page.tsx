"use client"
import { cn } from "@/lib/utils"
import { LiveDataFeed } from "../../components/live-data-feed"
import { Button } from "@/components/ui/button"
import React from "react"
import {api} from "@/trpc/react";
import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiChatInterface } from "./multichat-interface"

interface MultiHouseDetailsPageProps {
  houseIds: string[]
}

export default function MultiHouseDetailsPage({ houseIds }: MultiHouseDetailsPageProps) {
  console.log('houseIds', houseIds)
  const houses = api.house.getMultiHouseDetails.useQuery(houseIds)

  if (houses.isPending) return <div>Loading...</div>

  const getGridCols = (length: number) => {
    if (length <= 2) return 'grid-cols-2'
    if (length === 3) return 'grid-cols-3'
    if (length === 4) return 'grid-cols-4'
    if (length >= 5) return 'grid-cols-5'
  }

  return (
    <div className="w-full h-full md:max-h-[100vh] flex flex-col">
      <div className="flex items-center p-4">
        <Link href="/dashboard" passHref>
          <Button variant="secondary" size="sm" className="mr-2">
            <ArrowLeftIcon className="mr-2" />
            Houses
          </Button>
        </Link>
        <h1 className="text-lg font-bold truncate">
          Multi-House Chat ({houses.data?.length} houses)
        </h1>
      </div>
      <Separator />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className="w-full md:w-[25%] border-r border-gray-200 px-3 sm:px-4">
          <Tabs defaultValue={houseIds[0]} className="w-full">
            <TabsList className={cn(
              "grid gap-2",
              getGridCols(houses.data?.length || 0)
            )}>
              {houses.data?.map((house, index) => (
                <TabsTrigger key={house.id} value={house.id}>
                  House {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {houses.data?.map((house) => (
              <TabsContent key={house.id} value={house.id}>
                <Accordion
                  type="single"
                  collapsible
                  className="bg-gray-50 px-3 rounded-lg my-0 mt-4 sm:my-4"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>House Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold">
                          {house.price
                            ? `$${house.price.toLocaleString()}`
                            : "Price not available"}
                        </h2>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Beds: {house.beds || "N/A"}</div>
                          <div>Baths: {house.baths || "N/A"}</div>
                          <div>Sqft: {house.sqft?.toLocaleString() || "N/A"}</div>
                          <div>Year Built: {house.yearBuilt || "N/A"}</div>
                        </div>
                        <div className="text-sm">
                          <p>
                            <strong>Address:</strong> {house.stAddress}, {house.city},{" "}
                            {house.state} {house.zipCode}
                          </p>
                          <p>
                            <strong>Lot Size:</strong>{" "}
                            {house.lotSqft
                              ? `${house.lotSqft.toLocaleString()} sqft`
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Price per Sqft:</strong>{" "}
                            {house.pricePerSqft ? `$${house.pricePerSqft}` : "N/A"}
                          </p>
                        </div>
                        <LiveDataFeed
                          houseId={house.id}
                          house={house}
                          isPending={houses.isPending}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="w-full md:w-[75%] flex flex-col flex-grow">
          <MultiChatInterface
            houseIds={houseIds}
          />
        </div>
      </div>
    </div>
  )
}