const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");

// @desc    Toggle Like or Dislike on a Post
// @route   POST /api/v1/likes/:postId
// @access  Protected
const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { type } = req.body; // Expect "like" or "dislike"

    if (!["like", "dislike"].includes(type)) {
        throw new ApiError(400, "Invalid type. Must be 'like' or 'dislike'");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Check existing interaction
    const existingLike = await Like.findOne({
        post: postId,
        user: req.user._id
    });

    let message = "";
    let updatedPost;

    if (existingLike) {
        // Scenario 1: Toggle Off (User clicks same button again)
        if (existingLike.type === type) {
            await Like.findByIdAndDelete(existingLike._id);

            // Decrement the specific counter
            const updateField = type === "like" ? { likesCount: -1 } : { dislikesCount: -1 };
            updatedPost = await Post.findByIdAndUpdate(postId, { $inc: updateField }, { new: true });

            message = `Removed ${type}`;
        }
        // Scenario 2: Switch (User clicks Dislike but was previously Liked)
        else {
            existingLike.type = type;
            await existingLike.save();

            // Decrement old count, Increment new count
            const incUpdate = type === "like"
                ? { likesCount: 1, dislikesCount: -1 }
                : { likesCount: -1, dislikesCount: 1 };

            updatedPost = await Post.findByIdAndUpdate(postId, { $inc: incUpdate }, { new: true });

            message = `Switched to ${type}`;
        }
    } else {
        // Scenario 3: New Interaction
        await Like.create({
            post: postId,
            user: req.user._id,
            type
        });

        const updateField = type === "like" ? { likesCount: 1 } : { dislikesCount: 1 };
        updatedPost = await Post.findByIdAndUpdate(postId, { $inc: updateField }, { new: true });

        message = `Added ${type}`;
    }

    return res.status(200).json(
        new ApiResponse(200, {
            likesCount: updatedPost.likesCount,
            dislikesCount: updatedPost.dislikesCount,
            userInteraction: existingLike && existingLike.type === type ? null : type
        }, message)
    );
});

// @desc    Get current user's interaction status for a post
// @route   GET /api/v1/likes/:postId/status
// @access  Protected
const getLikeStatus = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const interaction = await Like.findOne({
        post: postId,
        user: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            hasLiked: interaction?.type === "like",
            hasDisliked: interaction?.type === "dislike"
        }, "Interaction status fetched")
    );
});

module.exports = { togglePostLike, getLikeStatus };