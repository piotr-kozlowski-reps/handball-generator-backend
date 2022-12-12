import express from "express";
import {
  getAllTeams,
  getTeam,
  deleteTeam,
} from "../controllers/team-controller";
// const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
// const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
// const filesPayloadExists = require("../middleware/filesPaylodExists");

const router = express.Router();

////routes
router.get("/", getAllTeams);
router.get("/:id", getTeam);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png"]),
//   fileResolutionLimiter,
//   teamController.createTeam
// );
// router.put("/", teamController.updateTeam);
router.delete("/:id", deleteTeam);

export default router;
