const express = require("express");
const gameNameController = require("../controllers/game-name-controller");
const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
const router = express.Router();

const filesPayloadExists = require("../middleware/filesPaylodExists");

////routes
router.get("/", gameNameController.getAllGameNames);
router.get("/:id", gameNameController.getGameName);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
  fileResolutionLimiter,
  gameNameController.createGameName
);
router.put("/", gameNameController.updateGameName);
router.delete("/:id", gameNameController.deleteGameName);

module.exports = router;
