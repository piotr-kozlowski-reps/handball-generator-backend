import express from "express";
import {
  getAllGameNames,
  getGameName,
  deleteGameName,
} from "../controllers/game-name-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();

////routes
router.get("/", getAllGameNames);
router.get("/:id", getGameName);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
//   fileResolutionLimiter,
//   gameNameController.createGameName
// );
// router.put("/", gameNameController.updateGameName);
router.delete("/:id", deleteGameName);

export default router;
