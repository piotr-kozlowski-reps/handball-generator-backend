"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const backgroundImageSchema = new mongoose_1.default.Schema({
    backgroundImageName: { type: String, required: true, unique: true },
    backgroundImage: { type: String, required: true },
    backgroundImageThumbnail: { type: String, required: true },
});
backgroundImageSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("BackgroundImage", backgroundImageSchema);
