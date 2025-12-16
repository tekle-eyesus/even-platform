const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const TechHub = require("../models/techHubModel");
const slugify = require("../utils/slugify");

// @desc    Create a new Tech Hub
// @route   POST /api/v1/hubs
const createTechHub = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const slug = slugify(name);

    // Check if exists
    const existingHub = await TechHub.findOne({ slug });
    if (existingHub) {
        throw new ApiError(409, "Tech Hub with this name already exists");
    }

    const techHub = await TechHub.create({
        name,
        slug,
        description
    });

    return res.status(201).json(
        new ApiResponse(201, techHub, "Tech Hub created successfully")
    );
});

// @desc    Get all Tech Hubs
// @route   GET /api/v1/hubs
// @access  Public
const getAllTechHubs = asyncHandler(async (req, res) => {
    const hubs = await TechHub.find().select("-__v");

    return res.status(200).json(
        new ApiResponse(200, hubs, "Tech Hubs fetched successfully")
    );
});

// @desc    Get single Tech Hub details
// @route   GET /api/v1/hubs/:slug
// @access  Public
const getTechHub = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const hub = await TechHub.findOne({ slug });

    if (!hub) {
        throw new ApiError(404, "Tech Hub not found");
    }

    return res.status(200).json(
        new ApiResponse(200, hub, "Tech Hub fetched successfully")
    );
});

module.exports = { createTechHub, getAllTechHubs, getTechHub };