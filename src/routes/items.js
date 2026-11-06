
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Validate item IDs before querying PostgreSQL
function parseItemId(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) && id <= 2147483647
        ? id
        : null;
}

// GET /api/items
// Retrieve all items from PostgreSQL
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM items ORDER BY id"
        );

        res.status(200).json({
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// GET /api/items/:id
// Retrieve a single item
router.get("/:id", async (req, res) => {
    try {
        const id = parseItemId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                error: "Item ID must be a valid positive integer"
            });
        }

        const result = await pool.query(
            "SELECT * FROM items WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// POST /api/items
// Create a new item
router.post("/", async (req, res) => {
    try {
        const { title, completed = false } = req.body ?? {};

        if (
            typeof title !== "string" ||
            title.trim() === "" ||
            title.trim().length > 255 ||
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                error: "Valid title and completed value required"
            });
        }

        const result = await pool.query(
            `INSERT INTO items (title, completed)
             VALUES ($1, $2)
             RETURNING *`,
            [title.trim(), completed]
        );

        res.status(201).json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// PUT /api/items/:id
// Update title, completed, or both
router.put("/:id", async (req, res) => {
    try {
        const id = parseItemId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                error: "Item ID must be a valid positive integer"
            });
        }

        const body = req.body;

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body) ||
            Object.keys(body).length === 0 ||
            Object.keys(body).some(
                key => !["title", "completed"].includes(key)
            )
        ) {
            return res.status(400).json({
                error: "Provide title, completed, or both"
            });
        }

        const { title, completed } = body;

        if (
            (title !== undefined &&
                (typeof title !== "string" ||
                 title.trim() === "" ||
                 title.trim().length > 255)) ||
            (completed !== undefined &&
                typeof completed !== "boolean")
        ) {
            return res.status(400).json({
                error: "Invalid title or completed value"
            });
        }

        const result = await pool.query(
            `UPDATE items
             SET title = COALESCE($1, title),
                 completed = COALESCE($2, completed)
             WHERE id = $3
             RETURNING *`,
            [
                title === undefined ? null : title.trim(),
                completed === undefined ? null : completed,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// DELETE /api/items/:id
// Permanently delete an item
router.delete("/:id", async (req, res) => {
    try {
        const id = parseItemId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                error: "Item ID must be a valid positive integer"
            });
        }

        const result = await pool.query(
            "DELETE FROM items WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json({
            message: "Item deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

export default router;
