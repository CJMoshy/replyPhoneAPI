import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const phoneNumbersTable = pgTable("phone_numbers", {
  id: uuid().defaultRandom().primaryKey(),
  phoneNumber: varchar({ length: 20 }).notNull(),
  status: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});