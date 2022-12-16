"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("../controllers/team-controller");
const filesPayloadExists_1 = __importDefault(require("../middleware/filesPayloadExists"));
const fileExtensionLimiter_1 = __importDefault(require("../middleware/fileExtensionLimiter"));
const fileResolutionLimiter_1 = __importDefault(require("../middleware/fileResolutionLimiter"));
const router = express_1.default.Router();
////routes
router.get("/", team_controller_1.getAllTeams);
router.get("/:id", team_controller_1.getTeam);
router.post("/", filesPayloadExists_1.default, (0, fileExtensionLimiter_1.default)([".png"]), fileResolutionLimiter_1.default, team_controller_1.createTeam);
router.put("/", team_controller_1.updateTeam);
router.delete("/:id", team_controller_1.deleteTeam);
exports.default = router;
