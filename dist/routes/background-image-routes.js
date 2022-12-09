"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const background_image_controller_1 = require("../controllers/background-image-controller");
// const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
// const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
// const filesPayloadExists = require("../middleware/filesPaylodExists");
const router = express_1.default.Router();
////routes
router.get("/", background_image_controller_1.getAllBackgroundImages);
router.get("/:id", background_image_controller_1.getBackgroundImage);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png", ".jpg", ".jpeg"]),
//   // fileResolutionLimiter,
//   backgroundImageController.createBackgroundImage
// );
// router.put("/", backgroundImageController.updateBackgroundImage);
// router.delete("/:id", backgroundImageController.deleteBackgroundImage);
exports.default = router;
