import express from "express";
import { randomUUID } from "node:crypto";

const router = express.Router();

// Temporary in-memory database
let resources = [
    {
        id: "1",
        title: "Complete backend assignment",
        completed: false
    },
    {
        id: "2",
        title: "Review Express notes",
        completed: true
    }
];

// GET /api/resources
// Retrieve all resources
router.get("/", (req, res) => {
    res.status(200).json({
        data: resources
    });
});

// GET /api/resources/:id
// Retrieve one resource by ID
router.get("/:id", (req, res) => {
    const resource = resources.find(
        (item) => item.id === req.params.id
    );

    if (!resource) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    res.status(200).json({
        data: resource
    });
});

// POST /api/resources
// Create a new resource
router.post("/", (req, res) => {
    const { title, completed = false } = req.body ?? {};

    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            error: "Valid title and completed value required"
        });
    }

    const newResource = {
        id: randomUUID(),
        title: title.trim(),
        completed
    };

    resources.push(newResource);

    res.status(201).json({
        data: newResource
    });
});

// PUT /api/resources/:id
// Update an existing resource
router.put("/:id", (req, res) => {
    const resource = resources.find(
        (item) => item.id === req.params.id
    );

    if (!resource) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    const { title, completed } = req.body ?? {};

    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            error: "Valid title and completed value required"
        });
    }

    resource.title = title.trim();
    resource.completed = completed;

    res.status(200).json({
        data: resource
    });
});

// DELETE /api/resources/:id
// Delete an existing resource
router.delete("/:id", (req, res) => {
    const index = resources.findIndex(
        (item) => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    const deletedResource = resources.splice(index, 1)[0];

    res.status(200).json({
        message: "Resource deleted successfully",
        data: deletedResource
    });
});

export default router;

//GET all returns resources, GET by ID returns a single resource, POST creates a new resource, PUT updates an existing resource, and DELETE removes a resource. Each route includes basic validation and error handling.