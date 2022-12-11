import express from "express";
import {
  getAllBackgroundImages,
  getBackgroundImage,
  createBackgroundImages,
  updateBackgroundImage,
  deleteBackgroundImage,
} from "../controllers/background-image-controller";
import filesPayloadExists from "../middleware/filesPayloadExists";
import fileExtensionLimiter from "../middleware/fileExtensionLimiter";
import fileResolutionLimiter from "../middleware/fileResolutionLimiter";

const router = express.Router();
////routes
router.get("/", getAllBackgroundImages);
router.get("/:id", getBackgroundImage);
router.post(
  "/",
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
  fileResolutionLimiter,
  createBackgroundImages
);
router.put("/", updateBackgroundImage);
router.delete("/:id", deleteBackgroundImage);

export default router;
