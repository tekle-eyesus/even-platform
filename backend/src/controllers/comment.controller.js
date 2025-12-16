const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// @desc    Add a Comment to a Post
// @route   POST /api/v1/comments/:postId
// @access  Protected
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        content,
        post: postId,
        author: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});

// @desc    Get Comments for a specific Post
// @route   GET /api/v1/comments/:postId
// @access  Public
const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
    };

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
        throw new ApiError(404, "Post not found");
    }

    const comments = await Comment.find({ post: postId })
        .populate("author", "fullName username avatar")
        .sort(options.sort)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

    const total = await Comment.countDocuments({ post: postId });

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            pagination: {
                total,
                page: options.page,
                pages: Math.ceil(total / options.limit)
            }
        }, "Comments fetched successfully")
    );
});

// @desc    Update a Comment
// @route   PATCH /api/v1/comments/:commentId
// @access  Protected (Author only)
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this comment");
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

// @desc    Delete a Comment
// @route   DELETE /api/v1/comments/:commentId
// @access  Protected (Author only)
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Allow Author of comment OR Author of the post (moderation) could be added here
    // For now, strict: only comment author
    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

module.exports = { addComment, getPostComments, updateComment, deleteComment };