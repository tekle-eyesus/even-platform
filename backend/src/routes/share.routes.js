const Router = require("express").Router;
const { generateShareLinks } = require("../controllers/share.controller");

const router = Router();

router.route("/:postId").post(generateShareLinks);

module.exports = router;