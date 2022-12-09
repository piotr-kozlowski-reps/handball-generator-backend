"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const teamSchema = new mongoose_1.default.Schema({
    teamName: { type: String, required: true, unique: true },
    place: { type: String, required: true },
    teamCrestImage: { type: String, required: true },
});
teamSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("Team", teamSchema);
