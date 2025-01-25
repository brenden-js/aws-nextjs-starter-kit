import {
  index,
  integer, primaryKey, real,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import {relations, sql} from "drizzle-orm";

// You can adjust the table name like this to run multiple schemas on the same db for multiple projects
export const sqlLiteTable = sqliteTableCreator((name) => `your_project_name_${name}`);

export const waitlist = sqlLiteTable('waitlist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  state: text('state', { length: 2 }).notNull(),
  wantsUpdates: integer('wants_updates', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});


export const prompts = sqlLiteTable(
  "prompt",
  {
    promptId: text("promptId").notNull(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    prompt: text("prompt").notNull()
  },
  (table) => ({
    id: primaryKey({name: 'id', columns: [table.userId, table.promptId]}),
  })
)

export const houses = sqlLiteTable(
  "house",
  {
    createdAt: integer("createdAt", {mode: 'timestamp'}).notNull(),
    id: text("id").notNull().primaryKey(),
    baths: integer("baths"),
    beds: integer("beds"),
    city: text("city").notNull(),
    description: text("description"),
    details: text("details"),
    expertise: text("expertise"),
    garage: integer("garage"),
    lat: real("lat"),
    lotSqft: integer("lotSqft"),
    lon: real("lon"),
    price: integer("price").notNull(),
    pricePerSqft: real("pricePerSqft"),
    sqft: integer("sqft"),
    stAddress: text("stAddress").notNull(),
    status: text("status"),
    state: text("state").notNull(),
    stories: integer("stories"),
    styles: text("styles"),
    userId: text("userId").notNull(),
    yearBuilt: integer("yearBuilt"),
    zipCode: text("zipCode").notNull(),
    nearbyPlaces: text("nearbyPlaces"),
    investment: text("investment"),
    recentlySold: text("recentlySold"),
    claimed: integer("claimed"),
    propertyExpertise: text("propertyExpertise"),
    locationExpertise: text("locationExpertise"),
    financialExpertise: text("financialExpertise"),
    mainExpertise: text("mainExpertise"),
    seen: integer("seen"),
    flyAroundVideoLink: text("flyAroundVideoLink"),
    flyAroundVideoStatus: text("flyAroundVideoStatus"),
  },
  (house) => ({
    userIdIdx: index("houses_userId_idx").on(house.userId),
  })
)

export const houseRelations = relations(houses, ({many}) => ({
  generations: many(generations)
}))

export const generations = sqlLiteTable(
  "generations",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer('createdAt', {mode: 'timestamp'}).notNull(),
    houseId: text("houseId").notNull(),
    prompt: text("prompt").notNull(),
    text: text("text").notNull(),
    model: text("model", {length: 255}),
  }
)

export const generationsRelations = relations(generations, ({one}) => ({
  house: one(houses, {
    fields: [generations.houseId],
    references: [houses.id]
  })
}))


export const userApiLimits = sqlLiteTable(
  "userApiLimit",
  {
    id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
    createdAt: integer("createdAt", {mode: "timestamp"}).notNull(),
    updatedAt: integer("updatedAt", {mode: "timestamp"}),
    periodEnd: integer("periodEnd", {mode: "timestamp"}).notNull(),
    userId: text("userId").unique().notNull(),
    housesQuota: integer("housesQuota").notNull(),
    housesUsage: integer("housesUsage").notNull(),
    textQuota: integer("textQuota").notNull(),
    textUsage: integer("textUsage").notNull(),
    maxTokens: integer("maxTokens").notNull(),
    stripeCustomerId: text("stripeCustomerId").unique(),
    stripeSubscriptionId: text("stripeSubscriptionId", {length: 255}).unique(),
    stripePriceId: text("stripePriceId"),
    stripeCurrentPeriodEnd: integer("stripeCurrentPeriodEnd", {mode: "timestamp"}),
    zipCodesLimit: integer("zipCodesLimit"),
    zipCodesUsage: integer("zipCodesUsage").default(0).notNull(),
  }
);

export const zipCodes = sqlLiteTable(
  "zipCodes",
  {
    id: text("id").notNull().primaryKey(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    lastScannedAt: integer("lastScannedAt", {mode: "timestamp"}),
  }
);

export const zipCodeSubscriptions = sqlLiteTable(
  "zipCodeSubscriptions",
  {
    id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
    userId: text("userId")
      .notNull()
      .references(() => userApiLimits.userId, {onDelete: 'cascade'}), // When a user is deleted, cascade the delete to
                                                                      // their zip code subscriptions
    zipCodeId: text("zipCodeId")
      .notNull()
      .references(() => zipCodes.id, {onDelete: 'cascade'}), // When a zip code is deleted, cascade the delete to
                                                             // related subscriptions
  },
);

// Define relationships for easier querying
export const userApiLimitsRelations = relations(userApiLimits, ({many}) => ({
  zipCodeSubscriptions: many(zipCodeSubscriptions),
}));

export const zipCodeSubscriptionsRelations = relations(zipCodeSubscriptions, ({one}) => ({
  user: one(userApiLimits, {
    fields: [zipCodeSubscriptions.userId],
    references: [userApiLimits.userId],
  }),
  zipCode: one(zipCodes, {
    fields: [zipCodeSubscriptions.zipCodeId],
    references: [zipCodes.id],
  }),
}));