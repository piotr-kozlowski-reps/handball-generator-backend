const express = require("express");
const backgroundImageController = require("../controllers/background-image-controller");
const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
const router = express.Router();

const filesPayloadExists = require("../middleware/filesPaylodExists");

////routes
router.get("/", backgroundImageController.getAllBackgroundImages);
router.get("/:id", backgroundImageController.getBackgroundImage);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
  fileResolutionLimiter,
  backgroundImageController.createBackgroundImage
);
router.put("/", backgroundImageController.updateBackgroundImage);
router.delete("/:id", backgroundImageController.deleteBackgroundImage);

module.exports = router;
