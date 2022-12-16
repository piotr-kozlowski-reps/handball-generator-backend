import express from "express";
import {
  getAllSponsorsBars,
  getSponsorsBar,
  createSponsorsBar,
  deleteSponsorsBar,
} from "../controllers/sponsors-bar-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();

//routes
router.get("/", getAllSponsorsBars);
router.get("/:id", getSponsorsBar);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
  fileResolutionLimiter,
  createSponsorsBar
);
// router.put("/", sponsorsBarController.updateSponsorsBar);
router.delete("/:id", deleteSponsorsBar);

export default router;
