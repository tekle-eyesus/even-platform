const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Bookmark = require("../models/Bookmark.model");
const Post = require("../models/Post.model");

// @desc    Toggle Bookmark (Save/Unsave post)
// @route   POST /api/v1/bookmarks/:postId
// @access  Protected
const toggleBookmark = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const existingBookmark = await Bookmark.findOne({
        user: req.user._id,
        post: postId
    });

    if (existingBookmark) {
        // Unsave
        await Bookmark.findByIdAndDelete(existingBookmark._id);
        return res.status(200).json(
            new ApiResponse(200, { isBookmarked: false }, "Post removed from bookmarks")
        );
    } else {
        // Save
        await Bookmark.create({
            user: req.user._id,
            post: postId
        });
        return res.status(200).json(
            new ApiResponse(200, { isBookmarked: true }, "Post saved to bookmarks")
        );
    }
});

// @desc    Get all bookmarked posts for current user
// @route   GET /api/v1/bookmarks
// @access  Protected
const getBookmarkedPosts = asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.find({ user: req.user._id })
        .populate({
            path: "post",
            populate: {
                path: "author",
                select: "fullName username avatar"
            }
        })
        .sort({ createdAt: -1 }); // Recently saved first

    // Extract just the post objects
    const posts = bookmarks.map(b => b.post);

    return res.status(200).json(
        new ApiResponse(200, posts, "Bookmarks fetched successfully")
    );
});

// @desc    Check if a specific post is bookmarked by current user
// @route   GET /api/v1/bookmarks/:postId/status
// @access  Protected
const getBookmarkStatus = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const bookmark = await Bookmark.findOne({
        user: req.user._id,
        post: postId
    });

    return res.status(200).json(
        new ApiResponse(200, { isBookmarked: !!bookmark }, "Bookmark status fetched")
    );
});

module.exports = { toggleBookmark, getBookmarkedPosts, getBookmarkStatus };