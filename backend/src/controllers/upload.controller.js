const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// @desc    Upload an image locally and get the URL
// @route   POST /api/v1/upload/image
// @access  Protected
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }

    // Construct public URL
    // In local dev: http://localhost:8000/images/filename.jpg
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/images/${req.file.filename}`;

    return res.status(200).json(
        new ApiResponse(200, { imageUrl }, "Image uploaded successfully")
    );
});

module.exports = { uploadImage };