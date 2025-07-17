import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const phoneNumbersTable = pgTable("phone_numbers", {
  phoneNumber: varchar({ length: 20 }).notNull().primaryKey(),
  status: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});