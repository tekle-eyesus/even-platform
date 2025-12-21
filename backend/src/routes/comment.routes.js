const Router = require("express").Router;
const {
    addComment,
    getPostComments,
    getCommentReplies,
    toggleCommentClap,
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


router.route("/replies/:commentId")
    .get(getCommentReplies);

router.route("/clap/:commentId")
    .post(verifyJWT, toggleCommentClap);

module.exports = router;