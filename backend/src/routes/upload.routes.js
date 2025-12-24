const Router = require("express").Router;
const { uploadImage } = require("../controllers/upload.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

const router = Router();


router.use(verifyJWT);
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;