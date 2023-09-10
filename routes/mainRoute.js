const Router = require("express");
const router = new Router();

const postController = require("../controllers/postController");

router.get("/", postController.getAllPosts);
router.get("/popular", postController.getPopularPosts);

module.exports = router;
