import { drizzle } from 'drizzle-orm/postgres-js';

const db = drizzle("http://localhost:5432");

export { db }
