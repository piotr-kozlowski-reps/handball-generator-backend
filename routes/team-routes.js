const express = require("express");
const teamController = require("../controllers/team-controller");
const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
const router = express.Router();

const filesPayloadExists = require("../middleware/filesPaylodExists");

////routes
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeam);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png"]),
  fileResolutionLimiter,
  teamController.createTeam
);
router.put("/", teamController.updateTeam);
router.delete("/", teamController.deleteTeam);

module.exports = router;
