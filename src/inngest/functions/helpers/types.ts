export interface GoogleNearbyPlacesAPIResponse {
  places: Place[]
}

export interface Place {
  types: string[]
  displayName: DisplayName
  editorialSummary?: EditorialSummary
  goodForChildren?: boolean
  liveMusic?: boolean
  goodForWatchingSports?: boolean
  location: Location
}

export interface Location {
  latitude: number
  longitude: number
}

export interface DisplayName {
  text: string
  languageCode: string
}

export interface EditorialSummary {
  text: string
  languageCode: string
}
