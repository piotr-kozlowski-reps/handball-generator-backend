import express from "express";
import {
  getAllSponsorsBars,
  getSponsorsBar,
  deleteSponsorsBar,
} from "../controllers/sponsors-bar-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();

//routes
router.get("/", getAllSponsorsBars);
router.get("/:id", getSponsorsBar);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
//   fileResolutionLimiter,
//   sponsorsBarController.createSponsorsBar
// );
// router.put("/", sponsorsBarController.updateSponsorsBar);
router.delete("/:id", deleteSponsorsBar);

export default router;
