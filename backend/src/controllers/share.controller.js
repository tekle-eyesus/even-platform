const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Post = require("../models/postModel");

// @desc    Get shareable links and increment share count
// @route   POST /api/v1/share/:postId
// @access  Public
const generateShareLinks = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    post.sharesCount += 1;
    await post.save({ validateBeforeSave: false });

    // 3. Construct URLs
    // In production, this would come from process.env.CLIENT_URL
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const postUrl = `${baseUrl}/posts/${post.slug}`;
    const message = `Check out this article on EVEN: ${post.title}`;

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(message)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
        copy: postUrl // For the "Copy Link" button
    };

    return res.status(200).json(
        new ApiResponse(200, shareLinks, "Share links generated successfully")
    );
});

module.exports = { generateShareLinks };