"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileName = exports.createMulterStorage = void 0;
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const createMulterStorage = (multer) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            switch (req.originalUrl) {
                case "/api/team":
                    cb(null, path_1.default.join("dist", "images", "team-crests"));
                    return;
                case "/api/sponsors-bar":
                    cb(null, path_1.default.join("dist", "images", "sponsors-bars"));
                    return;
                case "/api/background-image":
                    // cb(null, path.join("images", "background-images"));
                    cb(null, path_1.default.join("dist", "images", "background-images"));
                    return;
                case "/api/game-name":
                    cb(null, path_1.default.join("dist", "images", "game-names"));
                    return;
            }
        },
        filename: (req, file, cb) => {
            cb(null, createFileName(file));
        },
    });
};
exports.createMulterStorage = createMulterStorage;
//utils
function createFileName(file) {
    console.log("createFileName: ");
    console.log({ file });
    const date = (0, date_fns_1.format)(Date.now(), "yyyyMMdd-HHmmss");
    return `${file.originalname.split(".")[0]}___${date}${path_1.default.extname(file.originalname)}`;
}
exports.createFileName = createFileName;
