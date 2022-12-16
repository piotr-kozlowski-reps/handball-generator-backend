import express from "express";
import {
  getAllGameNames,
  getGameName,
  deleteGameName,
  createGameName,
  updateGameName,
} from "../controllers/game-name-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();

////routes
router.get("/", getAllGameNames);
router.get("/:id", getGameName);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
  fileResolutionLimiter,
  createGameName
);
router.put("/", updateGameName);
router.delete("/:id", deleteGameName);

export default router;
