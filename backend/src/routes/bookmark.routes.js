const Router = require("express").Router;
const {
    toggleBookmark,
    getBookmarkedPosts,
    getBookmarkStatus
} = require("../controllers/bookmark.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT);

router.route("/").get(getBookmarkedPosts);
router.route("/:postId").post(toggleBookmark);
router.route("/:postId/status").get(getBookmarkStatus);

module.exports = router;