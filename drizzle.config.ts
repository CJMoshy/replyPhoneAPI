import { defineConfig } from "drizzle-kit";
require("dotenv").config();

export default defineConfig({
  schema: "./src/db/schema.ts", // update path if your schema is elsewhere
  out: "./drizzle",             // optional: where generated files go
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
