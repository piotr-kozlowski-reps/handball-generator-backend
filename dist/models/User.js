"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Admin: Number,
    },
    refreshToken: String,
});
userSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("User", userSchema);
