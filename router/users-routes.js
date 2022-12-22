const { getUsers, userSignup, userLogin } = require("../controller/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = require("express").Router();

router.route("/").get(getUsers);
router.route("/signup").post(fileUpload.single("image"), userSignup);
router.route("/login").post(userLogin);

module.exports = router;
