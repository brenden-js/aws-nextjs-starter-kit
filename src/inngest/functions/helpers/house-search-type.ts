export interface ListingSearchInCityResponse {
  data: House[]
  meta: Meta
  status: boolean
  message: string
}

interface House {
  zpid: number
  location: Location
  address: Address
  media: Media
  isFeatured: boolean
  isShowcaseListing: boolean
  rental: Rental
  currency: string
  country: string
  listingDateTimeOnZillow: number
  bestGuessTimeZone: string
  isUnmappable: boolean
  bathrooms: number
  bedrooms: number
  livingArea: number
  yearBuilt: number
  lotSizeWithUnit?: LotSizeWithUnit
  propertyType: string
  listing: Listing
  daysOnZillow: number
  isPreforeclosureAuction: boolean
  openHouseShowingList?: OpenHouseShowingList[]
  price: Price
  estimates: Estimates
  zillowOwnedProperty: ZillowOwnedProperty
  taxAssessment: TaxAssessment
  hdpView: HdpView
  region: Region
  personalizedResult: PersonalizedResult
  propertyDisplayRules: PropertyDisplayRules
  ssid: number
  comingSoonOnMarketDate?: number
  newConstruction?: NewConstruction
}

interface Location {
  latitude: number
  longitude: number
}

interface Address {
  streetAddress: string
  zipcode: string
  city: string
  state: string
  buildingId?: number
}

interface Media {
  propertyPhotoLinks: PropertyPhotoLinks
  thirdPartyPhotoLinks: ThirdPartyPhotoLinks
  hasVRModel: boolean
  hasVideos: boolean
  hasApprovedThirdPartyVirtualTour: boolean
  allPropertyPhotos: AllPropertyPhotos
}

interface PropertyPhotoLinks {
  highResolutionLink: string
}

interface ThirdPartyPhotoLinks {
  streetViewLink: string
  satelliteLink: string
  streetViewMetadataLink: string
}

interface AllPropertyPhotos {
  highResolution: string[]
}

interface Rental {
  areApplicationsAccepted: boolean
}

interface LotSizeWithUnit {
  lotSize: number
  lotSizeUnit: string
}

interface Listing {
  listingStatus: string
  listingSubType: ListingSubType
}

interface ListingSubType {
  isOpenHouse?: boolean
  isFSBA?: boolean
  isComingSoon?: boolean
  isNewConstruction?: boolean
}

interface OpenHouseShowingList {
  startTime: number
  endTime: number
}

interface Price {
  value: number
  pricePerSquareFoot: number
}

interface Estimates {
  zestimate?: number
  rentZestimate?: number
}

interface ZillowOwnedProperty {
  isZillowOwned: boolean
}

interface TaxAssessment {
  taxAssessedValue: number
  taxAssessmentYear: string
}

interface HdpView {
  listingStatus: string
  price: number
  hdpUrl: string
}

interface Region {}

interface PersonalizedResult {
  isViewed: boolean
}

interface PropertyDisplayRules {
  canShowAddress: boolean
  canShowOnMap: boolean
  agent: Agent
  mls: Mls
  builder: Builder
  soldByOffice: SoldByOffice
  listingCategory: string
}

interface Agent {}

interface Mls {
  brokerName: string
}

interface Builder {}

interface SoldByOffice {}

interface NewConstruction {
  isPremierBuilder: boolean
  newConstructionType: string
}

interface Meta {
  currentPage: number
  limit: number
  totalRecords: number
  totalPage: number
}
