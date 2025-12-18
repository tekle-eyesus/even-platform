const Router = require("express").Router;
const {
    getCurrentUser,
    updateAccountDetails,
    getUserProfile
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Public Route
router.route("/p/:username").get(getUserProfile);

// Protected Routes
router.use(verifyJWT);
router.route("/me").get(getCurrentUser);
router.route("/update-account").patch(updateAccountDetails);

module.exports = router;