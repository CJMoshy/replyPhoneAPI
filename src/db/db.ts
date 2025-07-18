import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from "dotenv"
dotenv.config()

const URI = process.env.TEST_ENV === 'true' ? process.env.TEST_DATABASE_URL as string : process.env.DATABASE_URL as string
console.log(`URI being used is: ${URI}`)
const db = drizzle(URI);

export { db }
