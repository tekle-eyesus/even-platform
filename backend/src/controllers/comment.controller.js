const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Comment = require("../models/commentModel");
const CommentClap = require("../models/commentClapModel");
const Post = require("../models/postModel");

// @desc    Add a Comment (or Reply)
// @route   POST /api/v1/comments/:postId
// @access  Protected
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body; // parentCommentId is optional for replies

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Prepare comment data
    const commentData = {
        content,
        post: postId,
        author: req.user._id
    };

    // If it's a reply
    if (parentCommentId) {
        const parent = await Comment.findById(parentCommentId);
        if (!parent) {
            throw new ApiError(404, "Parent comment not found");
        }
        commentData.parentComment = parentCommentId;

        // Increment replies count on the parent comment
        await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
    }

    const comment = await Comment.create(commentData);

    return res.status(201).json(
        new ApiResponse(201, comment, parentCommentId ? "Reply added successfully" : "Comment added successfully")
    );
});

// @desc    Get Top-Level Comments for a Post
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

    const query = { post: postId, parentComment: null };

    const comments = await Comment.find(query)
        .populate("author", "fullName username avatar")
        .sort(options.sort)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

    const total = await Comment.countDocuments(query);

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


// @desc    Get Replies for a specific Comment
// @route   GET /api/v1/comments/replies/:commentId
// @access  Public
const getCommentReplies = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const replies = await Comment.find({ parentComment: commentId })
        .populate("author", "fullName username avatar")
        .sort({ createdAt: 1 }); // Oldest first usually makes sense for replies reading flow

    return res.status(200).json(
        new ApiResponse(200, replies, "Replies fetched successfully")
    );
});


// @desc    Toggle Clap on a Comment
// @route   POST /api/v1/comments/:commentId/clap
// @access  Protected
const toggleCommentClap = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingClap = await CommentClap.findOne({
        comment: commentId,
        user: req.user._id
    });

    let isClapped = false;

    if (existingClap) {
        // Remove clap (Toggle off)
        await CommentClap.findByIdAndDelete(existingClap._id);

        // Decrement count
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { clapsCount: -1 } },
            { new: true }
        );
        isClapped = false;

        return res.status(200).json(
            new ApiResponse(200, { isClapped, clapsCount: updatedComment.clapsCount }, "Clap removed")
        );
    } else {
        // Add clap
        await CommentClap.create({
            comment: commentId,
            user: req.user._id
        });

        // Increment count
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { clapsCount: 1 } },
            { new: true }
        );
        isClapped = true;

        return res.status(200).json(
            new ApiResponse(200, { isClapped, clapsCount: updatedComment.clapsCount }, "Clap added")
        );
    }
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

module.exports = {
    addComment,
    getPostComments,
    getCommentReplies,
    toggleCommentClap,
    updateComment,
    deleteComment
};