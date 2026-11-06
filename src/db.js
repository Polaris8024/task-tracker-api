
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// Create a pool of connections to PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export default pool;
