const Router = require("express");

const router = new Router();

const postRoute = require("./postRoute");
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const uploadRoute = require("./uploadRoute");
const mainRoute = require("./mainRoute");

router.use("/", authRoute);
router.use("/", mainRoute);
router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/upload", uploadRoute);

module.exports = router;
