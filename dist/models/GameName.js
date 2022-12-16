"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const gameNameSchema = new mongoose_1.default.Schema({
    gameName: { type: String, required: true, unique: true },
    gameImage: { type: String, required: true },
});
gameNameSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("GameName", gameNameSchema);
