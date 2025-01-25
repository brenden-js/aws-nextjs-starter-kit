export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

interface FeatureProperties {
  zipCode: string;
  country: string;
  city: string;
  county: string;
  state: string;
}

interface FeatureGeometry {
  type: "Polygon";
  coordinates: [[number, number][]];
}

interface Feature {
  type: "Feature";
  properties: FeatureProperties;
  geometry: FeatureGeometry;
}

export interface ZipSearchResults {
  type: "FeatureCollection";
  features: Feature[];
}


export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}


// Search-Address Result

export interface SearchAddressResult {
  data: Data
  status: boolean
  message: string
}

export interface Data {
  description: string
  rentalApplicationsAcceptedType: string
  providerListingID: any
  whatILove: any
  showDescriptionDisclaimer: boolean
  postingUrl: any
  moveInReady: boolean
  imageLink: string
  streetViewImageUrl: string
  timeZone: string
  virtualTourUrl: any
  longitude: number
  latitude: number
  homeType: string
  homeStatus: string
  isZillowOwned: boolean
  isIncomeRestricted: any
  isHousingConnector: boolean
  price: number
  zestimate: number
  zestimateLowPercent: string
  zestimateHighPercent: string
  zestimateMinus30: string
  livingAreaValue: number
  lotAreaValue: number
  lotAreaUnits: string
  hoaFee: number
  hoaFeeFrequency: string
  monthlyHoaFee: number
  listingDataSource: string
  timeOnZillow: any
  daysOnZillow: any
  favoriteCount: number
  pageViewCount: number
  rentalDateAvailable: any
  listing_sub_type: ListingSubType
  rentalListingOwnerReputation: RentalListingOwnerReputation
  rentalListingOwnerContact: RentalListingOwnerContact
  roomForRent: any
  unassistedShowing: any
  primaryPublicVideo: any
  photoUrls: PhotoUrl[]
  photoUrlsHighRes: PhotoUrlsHighRe[]
  resoFacts: ResoFacts
  homeInsights: any[]
  scheduleTourUrl: ScheduleTourUrl
  richMediaVideos: any
  richMedia: any
  contactAgentUrl: ContactAgentUrl
  startOfferUrl: StartOfferUrl
  zoResaleStartAnOfferEnabled: any
  zoUpsellDisplayInfo: ZoUpsellDisplayInfo
  formattedChip: FormattedChip
  listingMetadata: ListingMetadata
  homeValueChartData: HomeValueChartDaum[]
}

export interface ListingSubType {
  is_roomForRent: boolean
}

export interface RentalListingOwnerReputation {
  contactCount: any
  applicationCount: any
}

export interface RentalListingOwnerContact {
  displayName: any
  phoneNumber: any
  photoUrl: string
}

export interface PhotoUrl {
  url: string
  subjectType: any
}

export interface PhotoUrlsHighRe {
  url: string
}

export interface ResoFacts {
  homeType: string
  propertySubType: any
  lotSize: string
  yearBuilt: number
  parkingFeatures: string[]
  parkingCapacity: number
  carportParkingCapacity: any
  garageParkingCapacity: any
  coveredParkingCapacity: any
  openParkingCapacity: any
  hasAttachedGarage: any
  hasCarport: any
  hasGarage: boolean
  hasOpenParking: any
  cooling: string[]
  hasCooling: boolean
  heating: string[]
  leaseTerm: any
  depositsAndFees: any
  laundryFeatures: string[]
  flooring: string[]
  appliances: string[]
  hasPrivatePool: any
  exteriorFeatures: string[]
  accessibilityFeatures: any
  patioAndPorchFeatures: any
  furnished: boolean
  hoaFee: string
  pricePerSquareFoot: number
  communityFeatures: any[]
  otherFacts: OtherFact[]
  atAGlanceFacts: AtAglanceFact[]
}

export interface OtherFact {
  name?: string
  value: string
}

export interface AtAglanceFact {
  factLabel: string
  factValue?: string
}

export interface ScheduleTourUrl {
  path: string
}

export interface ContactAgentUrl {
  path: string
}

export interface StartOfferUrl {
  path: string
}

export interface ZoUpsellDisplayInfo {
  eligibleLeadTypes: any[]
  entryActionLinks: any
}

export interface FormattedChip {
  mainPrice: any
  priceChange: any
  location: Location[]
  status: Status
  quickFacts: QuickFact[]
  additionalFacts: AdditionalFact[]
}

export interface Location {
  fullValue: string
  abbreviatedValue: any
}

export interface Status {
  fullValue: string
  abbreviatedValue: string
}

export interface QuickFact {
  elementType: string
  prefixLabel: any
  value: Value
  suffixLabel: SuffixLabel
  contentDescription: string
  jsMessage: any
}

export interface Value {
  fullValue: string
  abbreviatedValue: any
}

export interface SuffixLabel {
  fullValue: string
  abbreviatedValue: string
}

export interface AdditionalFact {
  elementType: string
  prefixLabel: PrefixLabel
  value: Value2
  suffixLabel?: SuffixLabel2
  contentDescription: string
  jsMessage: any
}

export interface PrefixLabel {
  fullValue: string
  abbreviatedValue: any
}

export interface Value2 {
  fullValue: string
  abbreviatedValue: any
}

export interface SuffixLabel2 {
  fullValue: string
  abbreviatedValue: any
}

export interface ListingMetadata {
  isAdsRestricted: boolean
}

export interface HomeValueChartDaum {
  name: string
  points: Point[]
}

export interface Point {
  x: number
  y: number
}


// old api start point

// Recently solds

export interface RecentlySoldResponse {
  data: Data
}

export interface Data {
  home_search: HomeSearch
}

export interface HomeSearch {
  __typename: string
  count: number
  total: number
  results: Result[]
}

export interface Result {
  __typename: string
  property_id: string
  listing_id: string
  plan_id: any
  status: string
  photo_count?: number
  branding: Branding[]
  location: Location
  open_houses: any
  description: Description
  virtual_tours?: VirtualTour[]
  matterport: boolean
  advertisers: Advertiser[]
  flags: Flags
  source: Source
  pet_policy?: PetPolicy
  community: any
  primary_photo?: PrimaryPhoto
  href: string
  list_price: number
  list_price_min: any
  list_price_max: any
  price_reduced_amount?: number
  estimate?: Estimate
  lead_attributes: LeadAttributes
  last_sold_date: string
  list_date: string
  products: Products
  last_sold_price: number
}

export interface Branding {
  __typename: string
  photo: any
  name: string
  phone: any
  link: any
}

export interface Location {
  __typename: string
  address: Address
  street_view_url: string
  county: County
}

export interface Address {
  __typename: string
  city: string
  line: string
  street_name: string
  street_number: string
  country: string
  postal_code: string
  state_code: string
  state: string
  coordinate: Coordinate
}

export interface Coordinate {
  __typename: string
  lat: number
  lon: number
  accuracy: any
}

export interface County {
  __typename: string
  fips_code: string
}

export interface Description {
  __typename: string
  type: string
  beds: number
  baths: number
  lot_sqft: number | undefined
  sqft: number
  beds_max: any
  beds_min: any
  sqft_max: any
  sqft_min: any
  baths_full: number
  baths_half?: number
  baths_min: any
  baths_max: any
  baths_full_calc: number
  baths_partial_calc?: number
}

export interface VirtualTour {
  __typename: string
  href: string
}

export interface Advertiser {
  __typename: string
  fulfillment_id: string
  name: string
  email?: string
  href?: string
  slogan?: string
  type: string
}

export interface Flags {
  __typename: string
  is_price_reduced: boolean
  is_new_construction: boolean
  is_foreclosure: boolean
  is_plan: boolean
  is_new_listing: boolean
  is_coming_soon: boolean
  is_contingent: boolean
  is_pending: boolean
}

export interface Source {
  __typename: string
  agents: Agent[]
  id: string
  type: string
  spec_id: any
  plan_id: any
  listing_href: any
  listing_id: string
}

export interface Agent {
  __typename: string
  id: string
  agent_id: string
  agent_name: string
  office_id: string
  office_name?: string
}

export interface PetPolicy {
  __typename: string
  cats: boolean
  dogs: boolean
}

export interface PrimaryPhoto {
  __typename: string
  href: string
}

export interface Estimate {
  __typename: string
  estimate: number
}

export interface LeadAttributes {
  __typename: string
  lead_type: string
  show_contact_an_agent: boolean
  opcity_lead_attributes: OpcityLeadAttributes
}

export interface OpcityLeadAttributes {
  __typename: string
  flip_the_market_enabled: boolean
}

export interface Products {
  __typename: string
  brand_name: string
  products: string[]
}



// House Details

export interface HouseDetailsResponse {
  data: Data
}

export interface Data {
  home: Home
}

export interface Home {
  __typename: string
  property_id: string
  last_update_date: string
  last_price_change_date: string
  last_price_change_amount: number
  listing_id: string
  status: string
  href: string
  days_on_market: number
  list_date: string
  create_date: string
  mortgage: Mortgage
  hoa: number
  // buyers: any
  description: Description
  // pet_policy: any
  assigned_schools: AssignedSchools
  nearby_schools: NearbySchools
  schools: Schools
  list_price: number
  list_price_min: number
  list_price_max: number
  price_per_sqft: number
  // community: any
  flags: Flags
  details: Detail[]
  tax_history: TaxHistory[]
  location: Location
  photo_count: number
  photos: Photo3[]
  property_history: PropertyHistory[]
  local: Local
  last_sold_price: number
  last_sold_date: string
  estimates: Estimates
  // virtual_tours: any
  // videos: any
  // matterport: any
  monthly_fees: number
  units: number
}

export interface Mortgage {
  __typename: string
  property_tax_rate: number
  rates_url: string
  insurance_rate: number
  estimate: Estimate
  average_rates: AverageRate2[]
}

export interface Estimate {
  __typename: string
  loan_amount: number
  monthly_payment: number
  total_payment: number
  down_payment: number
  average_rate: AverageRate
  monthly_payment_details: MonthlyPaymentDetail[]
}

export interface AverageRate {
  __typename: string
  rate: number
  loan_type: LoanType
}

export interface LoanType {
  __typename: string
  term: number
}

export interface MonthlyPaymentDetail {
  __typename: string
  type: string
  amount: number
  display_name: string
}

export interface AverageRate2 {
  __typename: string
  loan_type: LoanType2
  rate: number
}

export interface LoanType2 {
  __typename: string
  loan_id: string
}

export interface Description {
  __typename: string
  baths_consolidated: string
  baths: number
  heating: number
  cooling: string
  beds: number
  garage: number
  pool: boolean
  sqft: number
  styles: string[]
  lot_sqft: number | undefined
  units: number
  stories: number
  type: string
  sub_type: string
  text: string
  year_built: number
  name: string
}

export interface AssignedSchools {
  __typename: string
  schools: School[]
}

export interface School {
  __typename: string
  district: District
}

export interface District {
  __typename: string
  name: string
  id: string
  phone: string
  student_count: number
  grades: string[]
}

export interface NearbySchools {
  __typename: string
  schools: School2[]
}

export interface School2 {
  __typename: string
  assigned?: boolean
  coordinate: Coordinate
  distance_in_miles: number
  district: District2
  education_levels: string[]
  funding_type: string
  grades?: string[]
  id: string
  name: string
  parent_rating?: number
  rating?: number
  student_count?: number
}

export interface Coordinate {
  __typename: string
  lat: number
  lon: number
}

export interface District2 {
  __typename: string
  id: string
  name?: string
}

export interface Schools {
  __typename: string
  schools: School3[]
}

export interface School3 {
  __typename: string
  assigned?: boolean
  coordinate: Coordinate2
  distance_in_miles: number
  district: District3
  education_levels: string[]
  funding_type: string
  grades?: string[]
  id: string
  name: string
  parent_rating?: number
  rating?: number
  student_count?: number
}

export interface Coordinate2 {
  __typename: string
  lat: number
  lon: number
}

export interface District3 {
  __typename: string
  id: string
  name?: string
}

// export interface Products {
//   __typename: string
//   products: string[]
// }

// export interface LeadAttributes {
//   __typename: string
//   opcity_lead_attributes: OpcityLeadAttributes
//   ready_connect_mortgage: ReadyConnectMortgage
//   show_contact_an_agent: boolean
//   lead_type: string
//   show_lead_form: boolean
//   disclaimer_text: any
//   is_tcpa_message_enabled: any
//   show_text_leads: boolean
// }

// export interface OpcityLeadAttributes {
//   __typename: string
//   flip_the_market_enabled: boolean
//   cashback_enabled: boolean
//   phones: Phone[]
//   local_phone: string
// }

// export interface Phone {
//   __typename: string
//   number: string
//   category: string
// }

// export interface ReadyConnectMortgage {
//   __typename: string
//   show_contact_a_lender: boolean
//   show_veterans_united: boolean
// }

export interface Flags {
  __typename: string
  is_contingent: boolean
  is_garage_present: boolean
  is_new_construction: boolean
  is_pending: boolean
  is_short_sale: boolean
  is_foreclosure: boolean
  is_senior_community: boolean
  is_for_rent: boolean
  is_deal_available: boolean
  is_price_excludes_land: boolean
  is_promotion_present: boolean
  is_subdivision: boolean
  is_plan: boolean
  is_price_reduced: boolean
  is_new_listing: boolean
  is_coming_soon: boolean
}

// export interface Source {
//   __typename: string
//   id: string
//   disclaimer: Disclaimer
//   listing_id: string
//   plan_id: string
//   spec_id: string
//   community_id: string
//   name: string
//   type: string
//   raw: Raw
// }

// export interface Disclaimer {
//   __typename: string
//   text: string
//   href: string
// }

// export interface Raw {
//   __typename: string
//   style: string
//   tax_amount: any
// }

export interface Detail {
  __typename: string
  category: string
  text: string[]
}

export interface TaxHistory {
  __typename: string
  tax: number
  year: number
  assessment: Assessment
}
//
export interface Assessment {
  __typename: string
  building: number
  land: number
  total: number
}

export interface Location {
  __typename: string
  address: Address
  county: County
  street_view_url: string
  neighborhoods: string[]
}

export interface Address {
  __typename: string
  line: string
  street_number: string
  street_name: string
  street_suffix: string
  unit: string
  city: string
  state_code: string
  postal_code: string
  state: string
  coordinate: Coordinate
}

export interface County {
  __typename: string
  fips_code: string
}

// export interface Branding {
//   __typename: string
//   type: string
//   photo: any
//   name: string
//   phone: any
//   slogan: any
//   accent_color: any
//   link: any
// }

// export interface ConsumerAdvertiser {
//   __typename: string
//   advertiser_id: string
//   office_id: string
//   agent_id: string
//   name: string
//   phone?: string
//   type: string
//   href?: string
//   slogan: any
//   photo: Photo
//   show_realtor_logo: boolean
//   hours: any
// }
//
// export interface Photo {
//   __typename: string
//   href: any
// }

// export interface Advertiser {
//   __typename: string
//   fulfillment_id: string
//   name: string
//   type: string
//   team_name: any
//   email: string
//   href: string
//   state_license: string
//   phones: Phone2[]
//   // office: Office
//   broker: Broker
//   photo: Photo2
// }

// export interface Phone2 {
//   __typename: string
//   number: string
//   type: string
//   ext: string
// }

// export interface Office {
//   __typename: string
//   fulfillment_id: string
//   name: string
//   href: string
//   photo: any
//   email: string
//   phones: Phone3[]
// }

// export interface Phone3 {
//   __typename: string
//   number: string
//   type: string
//   ext: string
// }

// export interface Broker {
//   __typename: string
//   fulfillment_id: string
//   name: string
// }
//
// export interface Photo2 {
//   __typename: string
//   href: string
// }

export interface Photo3 {
  __typename: string
  href: string
  type: string
  tags: Tag[]
}

export interface Tag {
  __typename: string
  label: string
  probability: number
}

export interface PropertyHistory {
  __typename: string
  date: string
  event_name: string
  price: number
  source_name: string
  listing?: Listing
}

export interface Listing {
  __typename: string
  photos: Photo4[]
  description: Description2
}

export interface Photo4 {
  __typename: string
  href: string
  type: string
  tags: Tag2[]
}

export interface Tag2 {
  __typename: string
  label: string
  probability: number
}

export interface Description2 {
  __typename: string
  sqft: number
}

export interface Local {
  __typename: string
  noise: Noise
  flood: Flood
}

export interface Noise {
  __typename: string
  score: number
  noise_categories: NoiseCategory[]
}

export interface NoiseCategory {
  __typename: string
  type: string
  text: string
}

export interface Flood {
  __typename: string
  flood_factor_score: number
  fema_zone: string[]
}

export interface Estimates {
  __typename: string
  current_values: CurrentValue[]
  historical_values: HistoricalValue[]
  forecast_values: ForecastValue[]
}

export interface CurrentValue {
  __typename: string
  source: Source2
  estimate: number
  estimate_high: number
  estimate_low: number
  date: string
}

export interface Source2 {
  __typename: string
  type: string
  name: string
}

export interface HistoricalValue {
  __typename: string
  source: Source3
  estimates: Estimate2[]
}

export interface Source3 {
  __typename: string
  type: string
  name: string
}

export interface Estimate2 {
  __typename: string
  estimate: number
  date: string
}

export interface ForecastValue {
  __typename: string
  source: Source4
  estimates: Estimate3[]
}

export interface Source4 {
  __typename: string
  type: string
  name: string
}

export interface Estimate3 {
  __typename: string
  estimate: number
  date: string
}

export interface AutocompleteResponse {
  meta: Meta
  autocomplete: Autocomplete[]
}

export interface Meta {
  version: string
  es_took: number
  es_total_hits: number
}

export interface Autocomplete {
  area_type: string
  _id: string
  _score: number
  mpr_id?: string
  full_address?: string[]
  line?: string
  city?: string
  postal_code?: string
  state_code: string
  country: string
  centroid: Centroid
  prop_status?: string[]
  validation_code?: string[]
  slug_id?: string
  geo_id?: string
  street?: string
  suffix?: string
  city_slug_id?: string
  state?: string
}

export interface Centroid {
  lon: number
  lat: number
}

