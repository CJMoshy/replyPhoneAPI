import { defineConfig } from "drizzle-kit";
require("dotenv").config();

const URI = process.env.TEST_ENV === 'true' ? process.env.TEST_DATABASE_URL as string : process.env.DATABASE_URL as string

export default defineConfig({
  schema: "./src/db/schema.ts", // update path if your schema is elsewhere
  out: "./drizzle",             // optional: where generated files go
  dialect: "postgresql",
  dbCredentials: {
    url: URI
  }
});
