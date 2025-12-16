const Router = require("express").Router;
const { createTechHub, getAllTechHubs, getTechHub } = require("../controllers/techhub.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Public Routes
router.route("/").get(getAllTechHubs);
router.route("/:slug").get(getTechHub);

// Protected Routes
router.route("/").post(verifyJWT, createTechHub);

module.exports = router;