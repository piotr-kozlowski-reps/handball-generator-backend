"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const background_image_controller_1 = require("../controllers/background-image-controller");
const filesPayloadExists_1 = __importDefault(require("../middleware/filesPayloadExists"));
const fileExtensionLimiter_1 = __importDefault(require("../middleware/fileExtensionLimiter"));
const fileResolutionLimiter_1 = __importDefault(require("../middleware/fileResolutionLimiter"));
const router = express_1.default.Router();
////routes
router.get("/", background_image_controller_1.getAllBackgroundImages);
router.get("/:id", background_image_controller_1.getBackgroundImage);
router.post("/", filesPayloadExists_1.default, (0, fileExtensionLimiter_1.default)([".png", ".jpg", ".jpeg"]), fileResolutionLimiter_1.default, background_image_controller_1.createBackgroundImages);
router.put("/", background_image_controller_1.updateBackgroundImage);
router.delete("/:id", background_image_controller_1.deleteBackgroundImage);
exports.default = router;
