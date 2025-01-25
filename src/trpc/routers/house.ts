import {createTRPCRouter, protectedProcedure} from "../trpc";
import {z} from "zod";
import axios, {type AxiosRequestConfig, type AxiosResponse} from 'axios';
import process from "process";
import {TRPCError} from "@trpc/server";
import {and, eq, inArray} from "drizzle-orm";
import {AutocompleteResponse, ZipSearchResults,} from "@/trpc/routers/helpers/types";
import {v4} from "uuid";
import {getMaxTokens, getOrCreateApiLimits} from "@/trpc/routers/helpers/api-restrictions";
import {db} from "@/db";
import {generations, houses, userApiLimits, zipCodes, zipCodeSubscriptions} from "@/db/schema";
import {inngest} from "@/inngest/client";
import Together from "together-ai";
import {GoogleGenerativeAI} from "@google/generative-ai";

type ZipCodeDetails = {
  City: string;
  State: string;
  Latitude: number;
  Longitude: number;
  ZipCode: string;
  County: string;
};

export const houseRouter = createTRPCRouter({
    searchHouse: protectedProcedure
      .input(z.object({stAddress: z.string()}))
      .mutation(async ({input, ctx}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized."})
        }

        const apiLimits = await getOrCreateApiLimits(ctx.authObject.userId)


        if (apiLimits.housesUsage >= apiLimits.housesQuota) {
          throw new TRPCError({message: "You have reached your usage.", code: "UNAUTHORIZED"})
        }
        const options = {
          method: 'GET',
          url: "https://realty-in-us.p.rapidapi.com/locations/v2/auto-complete",
          params: {
            input: `${input.stAddress}`,
            limit: '1'
          },
          headers: {
            'X-RapidAPI-Key': process.env.HOUSE_DATA_API_KEY,
            'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
          }
        } as AxiosRequestConfig;

        const response: AxiosResponse = await axios.request(options);

        const autoCompleteResponse = response.data as AutocompleteResponse

        if (autoCompleteResponse.autocomplete.length < 1) {
          throw new Error('House not found')
        }

        // format for returning to client
        const house = autoCompleteResponse.autocomplete[0]

        if (!house?.mpr_id) {
          throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Could not find house. "})
        }


        // send an event to enrich this house

        const newId = v4()

        await inngest.send({
          name: "house/enrich",
          data: {
            lookupId: house.mpr_id,
            houseId: newId,
            userId: ctx.authObject.userId,
          }
        })

        if (!house.line || !house.postal_code || !house.city || !house.state_code) {
          throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Uh oh something happened."})
        }

        return {
          stAddress: house.line,
          zipCode: house.postal_code,
          city: house.city,
          state: house.state_code,
          id: newId,
          expertise: null,
          lat: null,
          nearbyPlaces: null,
          investment: null,
          recentlySold: null,
          claimed: 0
        }
      }),
    updateExpertise: protectedProcedure
      .input(z.object(
        {
          expertise: z.string(),
          houseId: z.string()
        })
      )
      .mutation(async ({input, ctx}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({message: "No auth found", code: "UNAUTHORIZED"})
        }
        await db.update(houses).set({expertise: input.expertise})
          .where(and(eq(houses.userId, ctx.authObject.userId), eq(houses.id, input.houseId)))
      }),
    getHouses: protectedProcedure
      .query(async ({ctx}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized to perform this action."})
        }
        // query for most recent 25 houses with pagination
        return db.query.houses.findMany({
          where: eq(houses.userId, ctx.authObject.userId),
          orderBy: (houses, {desc}) => desc(houses.createdAt),
        });
      }),
    getHouseGenerations: protectedProcedure
      .input(z.string())
      .query(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "Internal code 98"})
        }
        return db.query.generations.findMany({
          where: eq(generations.houseId, input),
          orderBy: (generations, {desc}) => desc(generations.createdAt)
        });
      }),
    getHouseDetails: protectedProcedure
      .input(z.string())
      .query(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "Internal code 98"})
        }
        return db.query.houses.findFirst({
          where: and(eq(houses.userId, ctx.authObject.userId), eq(houses.id, input)),
        });
      }),
    getMultiHouseDetails: protectedProcedure
      .input(z.array(z.string()))
      .query(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "Internal code 98"});
        }

        console.log(input)

        if (input.length === 0) {
          return [];
        }

        const multiHouseDetails = await ctx.db.query.houses.findMany({
          where: and(
            eq(houses.userId, ctx.authObject.userId),
            inArray(houses.id, input)
          ),
        });

        // Ensure we only return houses that belong to the user
        const authorizedHouses = multiHouseDetails.filter(
          (house) => house.userId === ctx.authObject.userId
        );

        return authorizedHouses;
      }),
    setSeen: protectedProcedure
      .input(z.object({houseId: z.string()}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized to perform this action."})
        }
        const house = await db.query.houses.findFirst({where: and(eq(houses.id, input.houseId), eq(houses.userId, ctx.authObject.userId))})
        if (!house) {
          throw new TRPCError({code: "NOT_FOUND", message: "Could not find that house."})
        }
        await db.update(houses).set({seen: 1}).where(eq(houses.id, input.houseId))
        return {status: "House seen successfully"}
      }),
    deleteChat: protectedProcedure
      .input(z.object({houseId: z.string(), topic: z.enum(["Property", "Location", "Financial", "Main"])}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized to perform this action."})
        }
        const house = await db.query.houses.findFirst({where: eq(houses.id, input.houseId)})
        if (!house) {
          throw new TRPCError({code: "NOT_FOUND", message: "Could not find that house."})
        }
        await db.update(houses).set({
          [input.topic.toLowerCase() + "Expertise"]: null
        }).where(eq(houses.id, input.houseId))
      }),
    claimHouse: protectedProcedure
      .input(z.object({houseId: z.string()}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.authObject.userId) {
          throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized to perform this action."})
        }
        const house = await db.query.houses.findFirst({where: eq(houses.id, input.houseId)})
        if (!house) {
          throw new TRPCError({code: "NOT_FOUND", message: "Could not find that house."})
        }
        await db.update(houses).set({claimed: 1}).where(eq(houses.id, input.houseId))
        await inngest.send({
          name: "house/enrich",
          data: {
            lookupId: undefined,
            houseId: house.id,
            userId: ctx.authObject.userId,
          }
        })
        return {status: "House claimed successfully", claimed: 1}
      }),
    getAerialView: protectedProcedure
      .input(z.object({houseId: z.string()}))
      .query(async ({input}) => {
        // 1. Query the database for the house address
        const house = await db.query.houses.findFirst({
          where: eq(houses.id, input.houseId)
        });

        if (!house) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'House not found',
          });
        }
      }),
    requestAerialView: protectedProcedure
      .input(z.object({houseId: z.string()}))
      .mutation(async ({input}) => {
        // 1. Query the database for the house address
        const house = await db.query.houses.findFirst({
          where: eq(houses.id, input.houseId)
        });

        if (!house) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'House not found',
          });
        }

        // 2. Make a request to the Google Aerial View API
        try {
          const response = await axios.post(
            'https://aerialview.googleapis.com/v1/videos:renderVideo',
            {
              address: `${house.stAddress}, ${house.city}, ${house.state} ${house.zipCode}`,
            },
            {
              params: {
                key: process.env.GOOGLE_API_KEY,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('Response from Google Aerial View API:', response.data);

          // 3. Return the result

          await db.update(houses).set({
            flyAroundVideoLink: response.data.videoId,
            flyAroundVideoStatus: 'pending',
          }).where(eq(houses.id, input.houseId));

          return response.data;
        } catch (error) {
          console.error('Error fetching aerial view:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch aerial view',
          });
        }
      }),
    searchZipCode:
      protectedProcedure
        .input(z.object({zipCode: z.string()}))
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to perform this action."
            });
          }
          console.log('Searching zip code in our DB...')

          const userZipCode = await db.query.zipCodeSubscriptions.findFirst({
            where: eq(zipCodeSubscriptions.zipCodeId, input.zipCode)
          });

          if (userZipCode) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have already subscribed to this zip code."
            });
          }

          const zipCode = await db.query.zipCodes.findFirst({
            where: eq(zipCodes.id, input.zipCode),
          });

          if (zipCode) {
            console.log('Zip code found in our DB...')
            return zipCode;
          } else {
            const getZipCodeDetails = async (zipCode: string): Promise<ZipCodeDetails> => {
              try {
                const response = await axios.get<ZipCodeDetails>(
                  `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipCode}?key=${process.env.ZIPCODE_API_KEY}`
                );
                return response.data;
              } catch (error) {
                console.error('Error fetching ZIP code details:', error);
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Zip code not found."
                })
              }
            };

            const details = await getZipCodeDetails(input.zipCode);

            const cityLowerCase = details.City.toLocaleLowerCase();

            const formattedCity = cityLowerCase.charAt(0).toUpperCase() + cityLowerCase.slice(1);

            return {
              city: formattedCity,
              state: details.State,
              id: details.ZipCode,
            }
          }
        }),
    getUserZipCodes:
      protectedProcedure
        .query(async ({ctx}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to perform this action."
            });
          }
          const userZipCodes = await db.query.zipCodeSubscriptions.findMany({
            where: eq(zipCodeSubscriptions.userId, ctx.authObject.userId),
            with: {
              zipCode: true // Include the related zip code data
            }
          });
          const l = userZipCodes[0]

          // Extract zip code information
          const zipCodes = userZipCodes.map(userZipCode => userZipCode.zipCode);

          return zipCodes;
        }),
    setUserZipCode:
      protectedProcedure
        .input(z.object({zipCode: z.string(), city: z.string(), state: z.string()}))
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to perform this action."
            });
          }

          // Get the user's API limits
          const userLimits = await getOrCreateApiLimits(ctx.authObject.userId);

          if (!userLimits) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "User API limits not found."
            });
          }

          if (userLimits.zipCodesLimit === null) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Upgrade your subscription to subscribe to zip codes."
            });
          }

          // Get the user's current zip codes
          const userZipCodes = await db.query.zipCodeSubscriptions.findMany({
            where: eq(zipCodeSubscriptions.userId, ctx.authObject.userId)
          });

          // Check if the user has reached their zip code limit

          if (userZipCodes.length >= userLimits.zipCodesLimit) { // Assuming you added zipCodesLimit to userApiLimits
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have reached your zip code limit."
            });
          }

          // check if user has already subscribed to this zip code
          const userZipCode = await db.query.zipCodeSubscriptions.findFirst({
            where: eq(zipCodeSubscriptions.zipCodeId, input.zipCode)
          });

          if (userZipCode) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have already subscribed to this zip code."
            });
          }

          // Check if the zip code already exists
          const existingZipCode = await db.query.zipCodes.findFirst({
            where: eq(zipCodes.id, input.zipCode)
          });

          let zipCodeId;
          if (!existingZipCode) {
            // Create a new zip code entry if it doesn't exist, use zip code as ID
            zipCodeId = input.zipCode;
            await db.insert(zipCodes).values({
              id: zipCodeId,
              city: input.city,
              state: input.state
            });
          } else {
            zipCodeId = existingZipCode.id;
          }

          await inngest.send({
            name: "zipcode/subscribe",
            data: {
              userId: ctx.authObject.userId,
              zipCodeId: zipCodeId
            }
          })

          return {status: "Zip code added successfully"};
        }),
    unsubscribeZipCode:
      protectedProcedure
        .input(z.object({zipCodeId: z.string()}))
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to perform this action."
            });
          }

          const user = await db.query.userApiLimits.findFirst({where: eq(userApiLimits.userId, ctx.authObject.userId)})
          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Could not find user."
            });
          }

          await db.delete(zipCodeSubscriptions).where(eq(zipCodeSubscriptions.zipCodeId, input.zipCodeId))

          await db.delete(houses).where(and(eq(houses.zipCode, input.zipCodeId), eq(houses.userId, ctx.authObject.userId)))

          await db.update(userApiLimits)
            .set({zipCodesUsage: user.zipCodesUsage - 1})
            .where(eq(userApiLimits.userId, ctx.authObject.userId))

          return {status: "Zip code unsubscribed successfully"};
        }),
    updateMultiChat:
      protectedProcedure
        .input(z.object({
          houseIds: z.array(z.string()).min(2),
          newChat: z.string().min(8),
          chatData: z.array(z.object({
            sender: z.string(),
            message: z.string(),
          })),
        }))
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({code: "UNAUTHORIZED", message: "You are not authorized."});
          }

          console.log('Starting to update multi-chat...');

          const userId = ctx.authObject.userId;

          // Query the database for all houses in the input array
          const housesData = await Promise.all(
            input.houseIds.map(async (houseId) => {
              const house = await db.query.houses.findFirst({
                where: eq(houses.id, houseId),
              });

              if (!house) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message: `Could not find the requested house with ID: ${houseId}`,
                });
              }

              return house;
            })
          );

          // Prepare the chat data
          let chatData = input.chatData;

          chatData.push({
            sender: "System",
            message: `You will be answering prompts about the following houses: ${JSON.stringify(housesData)}`
          });

          // Add the new chat message
          chatData.push({sender: "You", message: `input.newChat`});

          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
          const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-exp-0801"});

          console.log('Starting generation');

          const aiResponse = await model.generateContent(JSON.stringify(
            chatData.map((message) => ({
              role: message.sender,
              content: message.message,
            })).concat([
              {
                role: "user",
                content: input.newChat,
              },
            ])
          ));

          console.log('AI response.....', aiResponse.response.text());

          if (!aiResponse) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "AI response generation failed, please try again later.",
            });
          }

          chatData.push({
            sender: "Deena",
            message: aiResponse.response.text(),
          });

          console.log('Updated chat data...', chatData);

          // Note: We're not updating the database in this function as per the instructions

          return {
            status: "Multi-chat updated successfully",
            chatData
          };
        }),
    updateChat:
      protectedProcedure
        .input(
          z.object({
            topic: z.enum(["Property", "Location", "Financial", "Main"]),
            message: z.object({
              sender: z.string(),
              message: z.string(),
            }),
            houseId: z.string(),
          })
        )
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized.",
            });
          }

          console.log('Starting to update chat...')

          const userId = ctx.authObject.userId;

          const house = await db.query.houses.findFirst({
            where: eq(houses.id, input.houseId),
          });

          console.log('house...', house)

          if (!house) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Could not find the requested house.",
            });
          }

          let chatData;
          switch (input.topic) {
            case "Property":
              chatData = JSON.parse(house.propertyExpertise || "[]");
              break;
            case "Location":
              chatData = JSON.parse(house.locationExpertise || "[]");
              break;
            case "Financial":
              chatData = JSON.parse(house.financialExpertise || "[]");
              break;
            case "Main":
              chatData = JSON.parse(house.mainExpertise || "[]");
              break;
          }

          if (input.topic === "Financial") {
            chatData.push({
              sender: "system",
              message: `Your name in this chat is Deena. You will not refer to yourself in that chat. You are not a financial advisor, however you will be helping real estate agents generate text content about the financial information for a house. 
                            Here is the house this chat is about: ${JSON.stringify(house)}
                            This is an exploratory chat, where you will help the user get all their expertise out so they can use it to create content. 
                            Ask the agent to expand on what they know about the house's financial situation, such as:
                            - Typical home prices and property taxes in the area
                            - Potential for renovations to improve the property's value
                            - Cost of living and affordability in the neighborhood
                            - Any relevant tax incentives or government programs for homebuyers
                            Ask the agent clarifying questions to better understand the financial context they need to provide to potential buyers. The goal is to create content that educates and informs the user, without getting into the specific numbers. This content should complement the agent's expertise and financial disclosures.`
            })
          } else if (input.topic === "Property") {
            chatData.push({
              sender: "system",
              message: `Your name in this chat is Deena. You will not refer to yourself in that chat. You are not a real estate expert, however you will be helping real estate agents generate text content about the property details for a house. 
                            Here is the house this chat is about: ${JSON.stringify(house)}
                            This is an exploratory chat, where you will help the user get all their expertise out so they can use it to create content. 
                            Ask the agent to expand on what they know about the house's property, such as:
                            - Architectural style and unique design elements
                            - Highlights of the floor plan and layout
                            - Notable amenities or special features (e.g. pool, garage, outdoor living spaces)
                            - Estimated square footage, bedrooms, bathrooms
                            - Age of the home and any recent renovations
                            Ask the agent clarifying questions to better understand what details would be most useful for potential buyers. The goal is to create content that sparks the user's interest and provides a vivid picture of the property, without overwhelming them with an exhaustive list of facts. This content should complement the agent's expertise and property listings.`
            })
          } else if (input.topic === "Location") {
            chatData.push({
              sender: "system",
              message: `Your name in this chat is Deena. You will not refer to yourself in that chat. You are not a real estate agent, however you will be helping real estate agents generate text content about the location and neighborhood for a house. 
                            Here is the house this chat is about: ${JSON.stringify(house)}
                            This is an exploratory chat, where you will help the user get all their expertise out so they can use it to create content. 
                            Ask the agent to expand on what they know about the neighborhood, such as:
                            - The overall vibe and character of the area (e.g. urban, suburban, family-friendly)
                            - Prominent landmarks, attractions, or points of interest nearby
                            - Description of the architecture, landscaping, and visual aesthetic
                            - Notable community events, activities, or cultural offerings
                            - Access to transportation, commute times, and walkability
                            - Quality of local schools, parks, and other community resources
                            Ask the agent clarifying questions to better understand what details would be most relevant and compelling for potential buyers. The goal is to create content that paints a vivid picture of what it would be like to live in this neighborhood, beyond just the physical location. This content should complement the agent's expertise and market knowledge.`
            })
          } else if (input.topic === 'Main') {
            chatData.push({
              sender: "system",
              message: `Your name in this chat is Deena. You are not a real estate agent, however you will be helping real estate agents generate text content about the main chat for a house. 
                            Here is the house this chat is about: ${JSON.stringify(house)}
                            This is a chat where you will help generate content for a real estate agent. 
                            This content should complement the agent's expertise and market knowledge.`
            })
          }


          chatData.push({sender: "You", message: `${input.message.message}`})

          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

          const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-exp-0801"});

          console.log('starting generation')

          const aiResponse = await model.generateContent(JSON.stringify(
            chatData.map((message: { sender: string, message: string }) => ({
              role: message.sender,
              content: message.message,
            })).concat([
              {
                role: "user",
                content: input.message.message,
              },
            ])
          ));

          console.log('Ai response.....', aiResponse.response.text());


          if (!aiResponse) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "AI response generation failed, please try again later.",
            });
          }

          chatData.push({
            sender: "Deena",
            message: aiResponse.response.text(),
          });

          console.log('Updated chat data...', chatData)

          const filteredChatData = chatData.filter((message: {
            sender: string,
            message: string
          }) => message.sender !== "system")

          await db.update(houses).set({
            [input.topic.toLowerCase() + "Expertise"]: JSON.stringify(filteredChatData),
          }).where(eq(houses.id, input.houseId))

          console.log('Updated house...', house.id)

          return {
            status: "Chat updated successfully",
            filteredChatData,
            chatTopic: input.topic,
          };
        }),
    getCustomFilters:
      protectedProcedure
        .input(
          z.object({
            query: z.string(),
          })
        )
        .mutation(async ({ctx, input}) => {
          if (!ctx.authObject.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized.",
            });
          }

          const userId = ctx.authObject.userId;

          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
          const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-exp-0801"});

          const prompt = `
      You are an AI assistant helping to convert natural language queries into JSON filters for a house listing database. 
      The available columns for filtering are: stAddress, city, zipCode, price, beds, baths, createdAt, and seen.
      
      Given the following query, generate a JSON object with two properties:
      1. "filters": An array of objects, each representing a column filter with "id" (column name), "value", and "operator" (e.g., "equals", "gt", "lt").
      2. "globalFilter": A string for general text search across all columns.

      For numeric values like price, beds, and baths, use appropriate operators (e.g., "gt" for greater than, "lt" for less than).
      For date values (createdAt), use ISO date strings.
      For boolean values (seen), use true or false.

      Query: "${input.query}"

      Respond only with the JSON object, no additional text.
    `;

          try {
            const aiResponse = await model.generateContent(prompt);
            const responseText = aiResponse.response.text();

            let parsedResponse;
            try {
              parsedResponse = JSON.parse(responseText);
            } catch (parseError) {
              console.error("Failed to parse AI response:", parseError);
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to parse the AI response.",
              });
            }

            if (!parsedResponse || typeof parsedResponse !== "object" || !Array.isArray(parsedResponse.filters)) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Invalid response format from AI.",
              });
            }

            // Convert the filters to the format expected by the table component
            const formattedFilters = parsedResponse.filters.map((filter: any) => ({
              id: filter.id,
              value: filter.value,
              operator: filter.operator,
            }));

            return {
              filters: formattedFilters,
              globalFilter: parsedResponse.globalFilter || "",
            };
          } catch (error) {
            console.error("Error generating custom filters:", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate custom filters. Please try again.",
            });
          }
        }),
  },
)

