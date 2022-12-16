"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll_General = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
// import BackgroundImage from "../models/BackgroundImage";
// import MongoDBUtils from "../utils/MongoDBUtils";
// import OverallUtils from "../utils/OverallUtils";
// import ImageFilesUtils from "../utils/ImageFilesUtils";
// import {
//   IImageProcessingError,
//   TBackgroundImage,
//   TDeleteFileResponse,
//   TUnprocessedImageResponse,
// } from "../utils/app.types";
const getAll_General = (model, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let resultArray;
        try {
            resultArray = yield model.find();
            console.log(resultArray);
        }
        catch (err) {
            return next(new http_error_1.default("Błąd serwera, spróbuj ponownie.", 500));
        }
        res.status(200).json(resultArray);
    });
    getAll(req, res, next);
});
exports.getAll_General = getAll_General;
