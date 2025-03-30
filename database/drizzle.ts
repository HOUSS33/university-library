import config  from "@/lib/config";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";


// Ensure that databaseUrl is defined, else throw an error
const databaseUrl = config.env.databaseUrl;
if (!databaseUrl) {
  throw new Error("Database URL is not defined");
}

const sql = neon(databaseUrl);

export const db = drizzle({ client: sql});
