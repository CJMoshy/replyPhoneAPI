import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const phoneNumbersTable = pgTable("phone_numbers", {
  id: uuid().defaultRandom().primaryKey(),
  phoneNumber: varchar({ length: 20 }).notNull(),
  status: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});

/**
 * The current solution now is to have this table that holds api keys
 * and to manually add the keys to the database. NOT A GOOD LONG-TERM SOLUTION.
 * However it is safer than a public get endpoint to create api keys
 * 
 * This solution to be used until we employ a proper auth service for clients and admins alike. 
 */
export const apiKeyTable = pgTable("API_KEY", {
  id: uuid().defaultRandom().primaryKey(),
  key: varchar({ length: 32 }).notNull(),
})