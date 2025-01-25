import React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../components/ui/card";
import {Badge} from "../../../components/ui/badge";
import {House} from "../contexts/prompts";
import {formatDistanceToNow} from 'date-fns'; // Import date-fns function
interface HousePreviewCardProps {
  house: House;
}

export const HousePreviewCard: React.FC<HousePreviewCardProps> = ({house}) => {
  if (!house) return null;
  return (
    <Card className={"hover:cursor-pointer min-h-44"}>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>{house.stAddress}</CardTitle>
          <div>
            {house.seen === 0 || house.seen === null && <Badge variant="default">New</Badge>}
            <Badge variant="secondary">{house.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}</Badge>
          </div>
        </div>
        <CardDescription className={""}>{house.createdAt
              ? formatDistanceToNow(new Date(house.createdAt), {addSuffix: true})
              : "unknown time ago"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <div className="text-sm text-gray-600">
            {house.city}, {house.state} {house.zipCode}
          </div>
          <div className="text-sm text-gray-600">
            {house.beds} beds | {house.baths} baths | {house.sqft} sqft
          </div>
        </div>
      </CardContent>
    </Card>
  );
};