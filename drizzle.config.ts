import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Force load your local environment variables
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts", // <-- Update this if your schema is located elsewhere!
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});