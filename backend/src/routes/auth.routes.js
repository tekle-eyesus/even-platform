const Router = require("express").Router;
const {
  registerUser,
  loginUser,
  googleLogin,
  githubLogin,
  githubCallback,
  logoutUser,
} = require("../controllers/auth.controller");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/google").post(googleLogin);
router.route("/github").get(githubLogin);
router.route("/github/callback").get(githubCallback);
router.route("/logout").post(logoutUser);

module.exports = router;
