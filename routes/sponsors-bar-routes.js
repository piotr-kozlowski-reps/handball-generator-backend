const express = require("express");
const sponsorsBarController = require("../controllers/sponsors-bar-controller");
const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
const router = express.Router();

const filesPayloadExists = require("../middleware/filesPaylodExists");

////routes
router.get("/", sponsorsBarController.getAllSponsorsBars);
router.get("/:id", sponsorsBarController.getSponsorsBar);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg"]),
  fileResolutionLimiter,
  sponsorsBarController.createSponsorsBar
);
router.put("/", sponsorsBarController.updateSponsorsBar);
router.delete("/", sponsorsBarController.deleteSponsorsBar);

module.exports = router;
