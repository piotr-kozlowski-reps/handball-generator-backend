import express from "express";
import {
  getAllBackgroundImages,
  getBackgroundImage,
} from "../controllers/background-image-controller";
// const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
// const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
// const filesPayloadExists = require("../middleware/filesPaylodExists");

const router = express.Router();
////routes
router.get("/", getAllBackgroundImages);
router.get("/:id", getBackgroundImage);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
//   // fileResolutionLimiter,
//   backgroundImageController.createBackgroundImage
// );
// router.put("/", backgroundImageController.updateBackgroundImage);
// router.delete("/:id", backgroundImageController.deleteBackgroundImage);

export default router;
