import express from "express";
import { logger } from "./middleware/logger.js";
import resourcesRouter from "./routes/resources.js";

const app = express();
const PORT = 3000;

// Parse incoming JSON
app.use(express.json());

// Log every request
app.use(logger);

// Connect the resource routes
app.use("/api/resources", resourcesRouter); //tells express that whenever a request begins with /api/resources, send it to the router defined in resources.js.

// Catch invalid routes
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});