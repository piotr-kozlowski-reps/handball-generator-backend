"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("../controllers/team-controller");
// const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
// const fileResolutionLimiter = require("../middleware/fileResolutionLimiter");
// const filesPayloadExists = require("../middleware/filesPaylodExists");
const router = express_1.default.Router();
////routes
router.get("/", team_controller_1.getAllTeams);
// router.get("/:id", teamController.getTeam);
// router.post(
//   "/",
//   filesPayloadExists,
//   fileExtensionLimiter([".png"]),
//   fileResolutionLimiter,
//   teamController.createTeam
// );
// router.put("/", teamController.updateTeam);
// router.delete("/:id", teamController.deleteTeam);
exports.default = router;
