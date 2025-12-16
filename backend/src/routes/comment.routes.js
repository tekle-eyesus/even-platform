const Router = require("express").Router;
const {
    addComment,
    getPostComments,
    updateComment,
    deleteComment
} = require("../controllers/comment.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Routes involving a Post ID
router.route("/:postId")
    .get(getPostComments)
    .post(verifyJWT, addComment);

router.route("/c/:commentId")       // Using /c/ to distinguish from /:postId easily
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);

module.exports = router;