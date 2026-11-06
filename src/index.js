
import express from "express";
import { logger } from "./middleware/logger.js";
import itemsRouter from "./routes/items.js";

const app = express();
const PORT = 3000;

// Log incoming requests
app.use(logger);

// Parse JSON request bodies
app.use(express.json());

// Connect PostgreSQL-backed routes
app.use("/api/items", itemsRouter);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Handle malformed JSON and unexpected errors
app.use((err, req, res, next) => {
    if (err.status === 400 && err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Invalid JSON body"
        });
    }

    console.error(err);

    res.status(500).json({
        error: "Internal server error"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
