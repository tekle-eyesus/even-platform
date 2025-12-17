const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Post = require("../models/postModel");

// @desc    Track a view on a post
// @route   POST /api/v1/analytics/view/:postId
// @access  Public
const trackPostView = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // The cookie 'viewed_posts' will store a JSON array of ID strings
    const viewedCookie = req.cookies?.viewed_posts;
    let viewedPosts = [];

    if (viewedCookie) {
        try {
            viewedPosts = JSON.parse(viewedCookie);
        } catch (error) {
            viewedPosts = [];
        }
    }

    // If already viewed recently, return success but don't increment
    if (viewedPosts.includes(postId)) {
        return res.status(200).json(
            new ApiResponse(200, { viewed: false }, "Already viewed recently")
        );
    }

    // Increment database counter
    const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Update the cookie
    viewedPosts.push(postId);

    // Cookie options: Expires in 1 hour (users count as new view after 1 hour)
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000 // 1 hour
    };

    return res
        .status(200)
        .cookie("viewed_posts", JSON.stringify(viewedPosts), options)
        .json(
            new ApiResponse(200, { viewed: true, totalViews: post.views }, "View counted")
        );
});

// @desc    Get top trending posts (based on views)
// @route   GET /api/v1/analytics/trending
// @access  Public
const getTrendingPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ status: "published" })
        .sort({ views: -1 })
        .limit(5)
        .populate("author", "fullName username avatar")
        .select("title slug views createdAt");

    return res.status(200).json(
        new ApiResponse(200, posts, "Trending posts fetched")
    );
});

module.exports = { trackPostView, getTrendingPosts };