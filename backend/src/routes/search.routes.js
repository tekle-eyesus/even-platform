const Router = require("express").Router;
const { globalSearch } = require("../controllers/search.controller");

const router = Router();

router.route("/").get(globalSearch);

module.exports = router;
