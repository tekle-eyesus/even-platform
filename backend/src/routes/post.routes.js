const Router = require("express").Router;
const {
    createPost,
    getAllPosts,
    getPostBySlug,
    updatePost,
    deletePost
} = require("../controllers/post.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Public Routes
router.route("/").get(getAllPosts);
router.route("/:slug").get(getPostBySlug);

// Protected Routes
router.route("/").post(verifyJWT, createPost);
router.route("/:id").patch(verifyJWT, updatePost);
router.route("/:id").delete(verifyJWT, deletePost);

module.exports = router;