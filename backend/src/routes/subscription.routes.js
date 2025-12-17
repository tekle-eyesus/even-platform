const Router = require("express").Router;
const {
    toggleHubSubscription,
    toggleAuthorSubscription,
    getMySubscribedHubs,
    getMySubscribedAuthors
} = require("../controllers/subscription.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT);

// Actions
router.route("/hubs/:hubId").post(toggleHubSubscription);
router.route("/users/:userId").post(toggleAuthorSubscription);

// Readings (My Feed Settings)
router.route("/me/hubs").get(getMySubscribedHubs);
router.route("/me/authors").get(getMySubscribedAuthors);

module.exports = router;