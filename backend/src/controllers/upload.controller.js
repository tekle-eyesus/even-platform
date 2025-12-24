const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// @desc    Upload an image to Cloudinary
// @route   POST /api/v1/upload/image
// @access  Protected
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }

    const localFilePath = req.file.path;

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload image to cloud storage");
    }

    // Return the Secure URL
    return res.status(200).json(
        new ApiResponse(
            200,
            { imageUrl: cloudinaryResponse.secure_url },
            "Image uploaded successfully"
        )
    );
});

module.exports = { uploadImage };