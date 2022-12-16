"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_name_controller_1 = require("../controllers/game-name-controller");
const filesPayloadExists_1 = __importDefault(require("../middleware/filesPayloadExists"));
const fileExtensionLimiter_1 = __importDefault(require("../middleware/fileExtensionLimiter"));
const fileResolutionLimiter_1 = __importDefault(require("../middleware/fileResolutionLimiter"));
const router = express_1.default.Router();
////routes
router.get("/", game_name_controller_1.getAllGameNames);
router.get("/:id", game_name_controller_1.getGameName);
router.post("/", filesPayloadExists_1.default, (0, fileExtensionLimiter_1.default)([".png", ".jpg", ".jpeg"]), fileResolutionLimiter_1.default, game_name_controller_1.createGameName);
router.put("/", game_name_controller_1.updateGameName);
router.delete("/:id", game_name_controller_1.deleteGameName);
exports.default = router;
