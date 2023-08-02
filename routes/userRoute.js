const Router = require("express");

const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");
const userController = require("../controllers/userController");

const ROLES_LIST = require("../config/rolesList");

const router = new Router();

router.get("/me", verifyJWT, userController.getMe);
router.get(
  "/all",
  verifyJWT,
  verifyRoles(ROLES_LIST.admin),
  userController.getAllUsers
);
router.get("/posts", verifyJWT, userController.getAllPostsUser);
router.patch("/profile", verifyJWT, userController.userAvatarUpdate);

module.exports = router;
