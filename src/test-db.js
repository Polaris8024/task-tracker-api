
import pool from "./db.js";

try {
    const result = await pool.query("SELECT * FROM items");

    console.log("Connected to PostgreSQL successfully!");
    console.table(result.rows);
} catch (error) {
    console.error("Database connection failed:", error.message);
} finally {
    await pool.end();
}
