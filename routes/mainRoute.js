const Router = require("express");
const router = new Router();

const postController = require("../controllers/postController");

router.get("/", postController.getAllPosts);

module.exports = router;
