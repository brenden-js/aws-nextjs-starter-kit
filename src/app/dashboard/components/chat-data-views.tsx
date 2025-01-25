"use client"
import React, {useCallback, useState} from 'react';
import {House} from "../contexts/prompts";
import {MortgagePaymentChart} from "./chart-mortgage";
import {Place} from "../../../inngest/functions/helpers/types";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef, AdvancedMarkerProps
} from "@vis.gl/react-google-maps";
import {PinIcon} from "lucide-react";
import {Card, CardHeader} from "../../../components/ui/card";
import {Badge} from "../../../components/ui/badge";
import {AppreciationChart} from "./chart-appreciation";
import EquityChart from "./chart-equity";


// Property component
type PropertyViewProps = {
  house: House;
};

export const PropertyView: React.FC<PropertyViewProps> = ({house}) => {
    if (house) {
      return (
        <div>
          <h3 className="text-xl font-bold mb-4">Property Details</h3>
          <p><strong>Square Footage:</strong> {house.sqft} sq ft</p>
          <p><strong>Lot Size:</strong> {house.lotSqft ? `${house.lotSqft} sq ft` : 'N/A'}</p>
          <p><strong>Year Built:</strong> {house.yearBuilt || 'N/A'}</p>
          <p><strong>Bedrooms:</strong> {house.beds || 'N/A'}</p>
          <p><strong>Bathrooms:</strong> {house.baths || 'N/A'}</p>
          <p><strong>Garage:</strong> {house.garage ? `${house.garage} car` : 'N/A'}</p>
          <p><strong>Stories:</strong> {house.stories || 'N/A'}</p>
          <p><strong>Style:</strong> {house.styles || 'N/A'}</p>
          <p><strong>Price:</strong> ${house.price ? house.price.toLocaleString() : 'N/A'}</p>
          <p><strong>Price per sq ft:</strong> ${house.pricePerSqft ? house.pricePerSqft.toFixed(2) : 'N/A'}</p>
        </div>
      )
    }
  }
;

// Location component

type LocationViewProps = {
  nearbyPlaces: string;
  lat: number;
  lon: number;
};

export const LocationView: React.FC<LocationViewProps> = ({ nearbyPlaces, lat, lon }) => {
  const places: Place[] = React.useMemo(() => JSON.parse(nearbyPlaces), [nearbyPlaces]);

  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedPlaceId(id);

      if (marker) {
        setSelectedMarker(marker);
      }
    },
    []
  );

  const onMouseEnter = useCallback((id: string | null) => setHoveredPlaceId(id), []);
  const onMouseLeave = useCallback(() => setHoveredPlaceId(null), []);

  return (
    <>
      <div style={{height: '500px', width: '100%'}}>
        <Map
          center={{lat, lng: lon}}
          mapId={'234234'}
          defaultZoom={12}
          defaultCenter={{lat, lng: lon}}
          disableDefaultUI
          gestureHandling={'greedy'}
          clickableIcons={false} // Disable info window on click
        >
          <AdvancedMarkerWithRef
            key={`${lat}-${lon}`}
            position={{lat, lng: lon}}
            onMouseEnter={() => onMouseEnter(null)}
            onMouseLeave={onMouseLeave}
            anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM}
            style={{
              transform: `scale(${[hoveredPlaceId, selectedPlaceId].includes(null) ? 1.2 : 1})`,
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <Pin
              background={selectedPlaceId === null ? '#22ccff' : null}
              borderColor={selectedPlaceId === null ? '#1e89a1' : null}
              glyphColor={selectedPlaceId === null ? '#0f677a' : null}/>
          </AdvancedMarkerWithRef>
          {places.map((place, index) => (
            <AdvancedMarkerWithRef
              key={index}
              position={{lat: place.location.latitude, lng: place.location.longitude}}
              onMouseEnter={() => onMouseEnter(place.displayName.text)}
              onMouseLeave={onMouseLeave}
              anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM}
              style={{
                transform: `scale(${[hoveredPlaceId, selectedPlaceId].includes(place.displayName.text) ? 1.2 : 1})`,
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              <Pin
                background={selectedPlaceId === place.displayName.text ? '#22ccff' : null}
                borderColor={selectedPlaceId === place.displayName.text ? '#1e89a1' : null}
                glyphColor={selectedPlaceId === place.displayName.text ? '#0f677a' : null}/>
            </AdvancedMarkerWithRef>
          ))}

          {selectedMarker && (
            <InfoWindow anchor={selectedMarker} onCloseClick={() => setSelectedPlaceId(null)}>
              <h2>{selectedPlaceId}</h2>
            </InfoWindow>
          )}
        </Map>
      </div>
      <div className={"mt-4 grid gap-3 grid-cols-3"}>
        {places.map((place, index) => (
          <Card className={"col-span-3 xl:col-span-1"} key={index}>
            <CardHeader>
              <h3 className={"text-lg font-bold"}>{place.displayName.text}</h3>
              <h4>{place.editorialSummary?.text}</h4>
              <CategoryList categories={place.types}/>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

interface Props {
  categories: string[];
}

const CategoryList: React.FC<Props> = ({ categories }) => {
  const formattedCategories = categories.map((category) => {
    // Replace underscores with spaces and capitalize each word
    return category.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  });

  return (
    <ul className="flex flex-wrap gap-2">
      {formattedCategories.map((category, index) => (
        <li key={index}>
          <Badge variant="outline" className="mr-2">
            {category}
          </Badge>
        </li>
      ))}
    </ul>
  );
};


export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps
) => {
  const {children, ...advancedMarkerProps} = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          console.log('marker clicked');
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}>
      {children}
    </AdvancedMarker>
  );
};

// Financial component
export type LoanInfo = {
  total: string;
  closingCosts: string
  mip: string;
  tax: string;
  principalAndInterest: string;
};

export type Investment = {
  fhaLoan: LoanInfo;
  conventionalLoan: LoanInfo;
  fhaEquityOver30Years: { year: number; equity: string }[]
  conventionalEquityOver30Years: { year: number; equity: string }[]
};

type FinancialViewProps = {
  investment: Investment; // Correct prop type
  listingPrice: number;
};

export const FinancialView: React.FC<FinancialViewProps> = ({investment, listingPrice}) => {
  const {fhaLoan, conventionalLoan, fhaEquityOver30Years, conventionalEquityOver30Years} = investment;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 sm:col-span-1">
        <MortgagePaymentChart loan={fhaLoan} loanType="FHA"/>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <MortgagePaymentChart loan={conventionalLoan} loanType="Conventional"/>
      </div>
      <div className="col-span-2">
        <AppreciationChart/>
      </div>
      <div className={"col-span-2 sm:col-span-1"}>
        <EquityChart listingPrice={listingPrice} loanType={'fha'}/>
      </div>
      <div className={"col-span-2 sm:col-span-1"}>
        <EquityChart listingPrice={listingPrice} loanType={'conventional'}/>
      </div>
    </div>
  );
};