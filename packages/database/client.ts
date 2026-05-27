import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";
import * as schema from "./schema";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

export const db = drizzle(pool, {
    schema,
    logger: env.NODE_ENV === "development",
});

export { pool };