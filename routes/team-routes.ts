import express from "express";
import { getAllTeams } from "../controllers/team-controller";
// const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
// const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
// const filesPayloadExists = require("../middleware/filesPaylodExists");

const router = express.Router();

////routes
router.get("/", getAllTeams);
// router.get("/:id", teamController.getTeam);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png"]),
//   fileResolutionLimiter,
//   teamController.createTeam
// );
// router.put("/", teamController.updateTeam);
// router.delete("/:id", teamController.deleteTeam);

export default router;
