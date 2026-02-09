const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const TechHub = require("../models/TechHub.model");

// @desc    Global Search (Users, Hubs, Posts)
// @route   GET /api/v1/search?q=query
// @access  Public
const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(200).json(new ApiResponse(200, {}, "Empty query"));
  }

  const regex = new RegExp(q, "i");

  // Run queries in parallel for performance
  const [users, hubs, posts] = await Promise.all([
    // search users by fullName or username
    User.find({
      $or: [{ fullName: regex }, { username: regex }],
    })
      .select("fullName username avatar")
      .limit(3),

    // search tech hubs by name
    TechHub.find({ name: regex }).select("name slug image").limit(3),

    // search posts by title and only return published posts
    Post.find({ title: regex, status: "published" })
      .select("title slug author")
      .populate("author", "fullName avatar")
      .limit(3),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { users, hubs, posts }, "Search results fetched"),
    );
});

module.exports = { globalSearch };
