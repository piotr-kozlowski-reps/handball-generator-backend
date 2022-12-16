import express from "express";
import {
  getAllTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();

////routes
router.get("/", getAllTeams);
router.get("/:id", getTeam);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png"]),
  fileResolutionLimiter,
  createTeam
);
router.put("/", updateTeam);
router.delete("/:id", deleteTeam);

export default router;
