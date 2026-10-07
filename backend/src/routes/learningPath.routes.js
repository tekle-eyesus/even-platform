const Router = require("express").Router;
const {
  listLearningPaths,
  getLearningPath,
  createLearningPath,
  getMyLearningPaths,
  updatePathProgress,
  getPathProgress,
} = require("../controllers/learningPath.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").get(listLearningPaths).post(verifyJWT, createLearningPath);
router.route("/me").get(verifyJWT, getMyLearningPaths);
router.route("/:pathId").get(getLearningPath);
router
  .route("/:pathId/progress")
  .get(verifyJWT, getPathProgress)
  .post(verifyJWT, updatePathProgress);

module.exports = router;
