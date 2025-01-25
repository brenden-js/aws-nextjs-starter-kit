import {and, eq} from "drizzle-orm";
import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import process from "process";
import {v4 as uuidv4} from "uuid";
import {generations, houses, userApiLimits, zipCodes, zipCodeSubscriptions} from "@/db/schema";
import {db} from "@/db";
import {HouseDetailsResponse, RecentlySoldResponse} from "@/trpc/routers/helpers/types";
import {GoogleNearbyPlacesAPIResponse} from "@/inngest/functions/helpers/types";
import {inngest} from "@/inngest/client";
import {ListingSearchInCityResponse} from "@/inngest/functions/helpers/house-search-type";
import {calculateEquityOver30Years, calculateTotalMonthlyPayment} from "@/inngest/functions/helpers/investment-calcs";


export const incrementHouseUsage = inngest.createFunction(
  {id: "house-increment-anywhere-usage"},
  {event: "house/enrich"},
  async ({event}) => {
    const userApiLimit = await db.query.userApiLimits.findFirst({where: eq(userApiLimits.userId, event.data.userId)})
    if (!userApiLimit) {
      throw new Error('No user Api Limit found')
    }
    await db.update(userApiLimits)
      .set({housesUsage: userApiLimit.housesUsage + 1})
      .where(eq(userApiLimits.userId, event.data.userId))
  }
)

export const handleEnrichHouse = inngest.createFunction(
  {id: "house-enrich"},
  {event: "house/enrich"},
  async ({event, step}) => {
    const foundListing = await step.run("Get house details", async () => {

      if (!event.data.lookupId) {
        // No lookup id, this means the house was found via the listing scan, and we have the basic listing data already
        const house = await db.query.houses.findFirst({where: eq(houses.id, event.data.houseId)})
        if (!house) {
          throw new Error('Could not find house in database')
        }
        return {
          lat: house.lat,
          lon: house.lon,
          price: house.price,
          stAddress: house.stAddress,
          zipCode: house.zipCode
        }
      }

      const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://realty-in-us.p.rapidapi.com/properties/v3/detail',
        params: {property_id: event.data.lookupId},
        headers: {
          'X-RapidAPI-Key': process.env.HOUSE_DATA_API_KEY,
          'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
        }
      }

      const anotherResponse: AxiosResponse = await axios.request(options);
      const formatted = anotherResponse.data as HouseDetailsResponse

      console.log('Formatted.................', formatted)

      await db.insert(houses).values({
        id: event.data.houseId,
        createdAt: new Date(),
        baths: formatted.data.home.description.baths,
        beds: formatted.data.home.description.beds,
        city: formatted.data.home.location.address.city,
        claimed: 1,
        description: formatted.data.home.description.text,
        details: JSON.stringify(formatted.data.home.details),
        garage: formatted.data.home.description.garage,
        lat: formatted.data.home.location.address.coordinate.lat,
        lon: formatted.data.home.location.address.coordinate.lon,
        lotSqft: formatted.data.home.description.lot_sqft,
        price: formatted.data.home.list_price,
        pricePerSqft: formatted.data.home.price_per_sqft,
        sqft: formatted.data.home.description.sqft,
        stAddress: formatted.data.home.location.address.line,
        status: formatted.data.home.status,
        state: formatted.data.home.location.address.state,
        stories: formatted.data.home.description.stories,
        styles: JSON.stringify(formatted.data.home.description.styles),
        userId: event.data.userId,
        yearBuilt: formatted.data.home.description.year_built,
        zipCode: formatted.data.home.location.address.postal_code
      })
      console.log("Succesfully added house.")

      return {
        lat: formatted.data.home.location.address.coordinate.lat,
        lon: formatted.data.home.location.address.coordinate.lon,
        price: formatted.data.home.list_price,
        stAddress: formatted.data.home.location.address.line,
        zipCode: formatted.data.home.location.address.postal_code
      }
    })

    await step.run("Get google places data",
      async () => {
        const response = await axios(
          "https://places.googleapis.com/v1/places:searchNearby",
          {
            headers: {
              "X-Goog-FieldMask": "places.displayName,places.location,places.goodForChildren,places.liveMusic,places.goodForWatchingSports,places.editorialSummary,places.types",
              "X-Goog-Api-Key": process.env.GOOGLE_API_KEY!
            },
            method: "POST",
            data: {
              "includedTypes": [],
              "maxResultCount": 20,
              "locationRestriction": {
                "circle": {
                  "center": {
                    "latitude": foundListing.lat,
                    "longitude": foundListing.lon
                  },
                  "radius": 4000.0
                }
              }
            }
          }
        )

        const places = response.data as GoogleNearbyPlacesAPIResponse
        await db.update(houses)
          .set({nearbyPlaces: JSON.stringify(places.places)})
          .where(eq(houses.id, event.data.houseId))
      })

    await step.run("Get mortgage and investment info", async () => {
      if (foundListing.price === null) {
        console.log('No price was found, cannot get mortgage info')
        throw new Error('No price was found, cannot get mortgage info')
      }

      const conventionalLoan = calculateTotalMonthlyPayment('conventional', foundListing.price, 5.49)

      const fhaLoan = calculateTotalMonthlyPayment('fha', foundListing.price, 5.49)
      await db.update(houses).set({investment: JSON.stringify({conventionalLoan, fhaLoan})})
        .where(eq(houses.id, event.data.houseId))
    })

    // await step.run("Get recently sold listings", async () => {
    //     const data = JSON.stringify({
    //         limit: 10,
    //         offset: 0,
    //         postal_code: foundListing.zipCode,
    //         status: [
    //             'sold'
    //         ],
    //         sort: {
    //             direction: 'desc',
    //             field: 'list_date'
    //         }
    //     });
    //
    //     let response;
    //
    //     try {
    //         response = await axios.post('https://realty-in-us.p.rapidapi.com/properties/v3/list', data, {
    //             headers: {
    //                 'x-rapidapi-key': process.env.HOUSE_DATA_API_KEY,
    //                 'x-rapidapi-host': 'realty-in-us.p.rapidapi.com',
    //                 'Content-Type': 'application/json'
    //             },
    //             withCredentials: true
    //         });
    //
    //         if (!response) {
    //             return new Error('Could not get api response')
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     const formatted = response!.data as RecentlySoldResponse
    //
    //     const minimizedArray = formatted.data.home_search.results.map((soldListing) => {
    //         return {
    //             soldPrice: soldListing.last_sold_price,
    //             soldDate: soldListing.last_sold_date,
    //             beds: soldListing.description.beds,
    //             baths: soldListing.description.baths,
    //             lotSqft: soldListing.description.lot_sqft,
    //             sqft: soldListing.description.sqft,
    //             pricePerSqft: (soldListing.last_sold_price / soldListing.description.sqft).toFixed(2),
    //             stAddress: soldListing.location.address.line
    //         }
    //     })
    //
    //     console.log("minimzedArray...................", minimizedArray)
    //
    //     await db.update(houses).set({recentlySold: JSON.stringify(minimizedArray)}).where(eq(houses.id,
    // event.data.houseId)) })
  }
)

export const incrementTextUsage = inngest.createFunction(
  {id: "house-increment-text-usage"},
  {event: "house/add-generation"},
  async ({event}) => {
    const userApiLimit = await db.query.userApiLimits.findFirst({where: eq(userApiLimits.userId, event.data.userId)})
    if (!userApiLimit) {
      throw new Error('No user Api Limit found')
    }
    await db.update(userApiLimits)
      .set({textUsage: userApiLimit.textUsage + 1})
      .where(eq(userApiLimits.userId, event.data.userId))
  }
)

export const handleAddGeneration = inngest.createFunction(
  {id: 'house-add-generation'},
  {event: 'house/add-generation'},
  async ({event}) => {
    await db.insert(generations).values({
      id: uuidv4(),
      createdAt: new Date(),
      houseId: event.data.houseId,
      prompt: event.data.prompt,
      text: event.data.text,
      model: event.data.model,
    });
  }
)

