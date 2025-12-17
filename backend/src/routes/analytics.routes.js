const Router = require("express").Router;
const { trackPostView, getTrendingPosts } = require("../controllers/analytics.controller");

const router = Router();

// Track view (Fire and forget from frontend)
router.route("/view/:postId").post(trackPostView);

// Get stats
router.route("/trending").get(getTrendingPosts);

module.exports = router;