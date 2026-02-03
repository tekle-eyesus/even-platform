const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Post = require("../models/postModel");
const TechHub = require("../models/techHubModel");
const slugify = require("../utils/slugify");

// @desc    Create a new Post
// @route   POST /api/v1/posts
// @access  Protected
const createPost = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    techHubId,
    tags,
    status,
    summary,
    coverImage,
    contentImages,
  } = req.body;

  if (!title || !content || !techHubId) {
    throw new ApiError(400, "Title, Content, and Tech Hub are required");
  }

  const hubExists = await TechHub.findById(techHubId);
  if (!hubExists) {
    throw new ApiError(404, "Selected Tech Hub does not exist");
  }

  let slug = slugify(title);
  // Simple logic to handle duplicate titles: append random string if exists
  const existingSlug = await Post.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  const post = await Post.create({
    title,
    slug,
    content,
    coverImage: coverImage || "",
    contentImages: contentImages || [],
    summary: summary || content.substring(0, 150) + "...", // Fallback summary
    author: req.user._id,
    techHub: techHubId,
    tags: tags || [],
    status: status || "published",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

// @desc    Get All Posts (with Pagination & Filters)
// @route   GET /api/v1/posts
// @access  Public
const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, hub, author, tag } = req.query;

  const filter = { status: "published" };

  // Filter by Tech Hub (using slug)
  if (hub) {
    const hubDoc = await TechHub.findOne({ slug: hub });
    if (hubDoc) filter.techHub = hubDoc._id;
  }

  // Filter by Author (using ID)
  if (author) {
    filter.author = author;
  }

  // Filter by Tag
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Newest first
  };

  const posts = await Post.find(filter)
    .populate("author", "fullName username avatar")
    .populate("techHub", "name slug")
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await Post.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        pagination: {
          total,
          page: options.page,
          pages: Math.ceil(total / options.limit),
        },
      },
      "Posts fetched successfully",
    ),
  );
});

// @desc    Get Single Post by Slug
// @route   GET /api/v1/posts/:slug
// @access  Public
const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug })
    .populate("author", "fullName username avatar")
    .populate("techHub", "name slug description");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

// @desc    Update Post
// @route   PATCH /api/v1/posts/:id
// @access  Protected (Author only)
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, status, summary } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Ownership Check
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags || post.tags;
  post.status = status || post.status;
  post.summary = summary || post.summary;

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

// @desc    Delete Post
// @route   DELETE /api/v1/posts/:id
// @access  Protected (Author only)
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Ownership Check
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await Post.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
};
