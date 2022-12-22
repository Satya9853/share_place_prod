const { getPlaceByID, getPlacesByUserID, createPlace, updatePlaceByID, deletePlaceByID } = require("../controller/places-controller");

const router = require("express").Router();
const fileUpload = require("../middleware/file-upload");
const authenticationMiddleware = require("../middleware/authentication-middleware");

// these routed does not require auth token
router.route("/user/:userID").get(getPlacesByUserID);
router.route("/:placeID").get(getPlaceByID);
router.use(authenticationMiddleware);
router.route("/").post(fileUpload.single("image"), createPlace);
router.route("/:placeID").patch(updatePlaceByID).delete(deletePlaceByID);

module.exports = router;
