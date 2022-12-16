"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sponsors_bar_controller_1 = require("../controllers/sponsors-bar-controller");
const filesPayloadExists_1 = __importDefault(require("../middleware/filesPayloadExists"));
const fileExtensionLimiter_1 = __importDefault(require("../middleware/fileExtensionLimiter"));
const fileResolutionLimiter_1 = __importDefault(require("../middleware/fileResolutionLimiter"));
const router = express_1.default.Router();
//routes
router.get("/", sponsors_bar_controller_1.getAllSponsorsBars);
router.get("/:id", sponsors_bar_controller_1.getSponsorsBar);
router.post("/", filesPayloadExists_1.default, (0, fileExtensionLimiter_1.default)([".png", ".jpg", ".jpeg"]), fileResolutionLimiter_1.default, sponsors_bar_controller_1.createSponsorsBar);
// router.put("/", sponsorsBarController.updateSponsorsBar);
router.delete("/:id", sponsors_bar_controller_1.deleteSponsorsBar);
exports.default = router;
