const Router = require("express").Router;
const { togglePostLike, getLikeStatus } = require("../controllers/like.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT);

router.route("/:postId").post(togglePostLike);
router.route("/:postId/status").get(getLikeStatus);

module.exports = router;