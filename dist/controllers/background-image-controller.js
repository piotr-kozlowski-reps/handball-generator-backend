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
exports.deleteBackgroundImage = exports.updateBackgroundImage = exports.createBackgroundImages = exports.getBackgroundImage = exports.getAllBackgroundImages = void 0;
// const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");
// const { deleteFiles } = require("../utils/deleteFIle");
const http_error_1 = __importDefault(require("../utils/http-error"));
const BackgroundImage_1 = __importDefault(require("../models/BackgroundImage"));
const MongoDBUtils_1 = __importDefault(require("../utils/MongoDBUtils"));
const OverallUtils_1 = __importDefault(require("../utils/OverallUtils"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
const app_types_1 = require("../utils/app.types");
// const { createThumbnails } = require("../utils/createThumbnail");
const getAllBackgroundImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let backgrounds;
    try {
        backgrounds = yield BackgroundImage_1.default.find();
    }
    catch (err) {
        return next(new http_error_1.default("Błąd serwera, spróbuj ponownie.", 500));
    }
    res.status(200).json(backgrounds);
});
exports.getAllBackgroundImages = getAllBackgroundImages;
const getBackgroundImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return next(new http_error_1.default("Wymagane ID tła.", 400));
    }
    if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
        return next(new http_error_1.default("Podane ID ma złą formę.", 400));
    }
    let backgroundImage;
    try {
        backgroundImage = yield BackgroundImage_1.default.findOne({ _id: req.params.id });
    }
    catch (err) {
        return next(new http_error_1.default("Błąd serwera, spróbuj ponownie.", 500));
    }
    if (!backgroundImage) {
        return next(new http_error_1.default("Nie ma tła o takim ID.", 204));
    }
    res.status(200).json({ backgroundImage });
});
exports.getBackgroundImage = getBackgroundImage;
const createBackgroundImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const finalProcessedImagesArray = [];
    const finalUnprocessedImagesArray = [];
    let filesArray = req.files;
    if (!filesArray || (filesArray === null || filesArray === void 0 ? void 0 : filesArray.length) < 1) {
        return next(new http_error_1.default("Musisz przesłać choć jeden plik tła.", 400));
    }
    //generate backgroundImageName from names of files
    const backgroundImageNamesArray = filesArray.map((file) => {
        return file.originalname.split(".")[0];
    });
    if (OverallUtils_1.default.checkIfArrayHasDuplicates(backgroundImageNamesArray)) {
        deleteFiles(filesArray);
        return next(new http_error_1.default("W przesłanych plikach znajdowały się pliki o tej samej nazwie.", 400));
    }
    //check if any of backgroundImageNames exist already in Database
    let foundBackgrounds = [];
    try {
        for (let i = 0; i < backgroundImageNamesArray.length; i++) {
            const foundBackgroundInDB = yield BackgroundImage_1.default.findOne({
                backgroundImageName: backgroundImageNamesArray[i],
            });
            if (foundBackgroundInDB)
                foundBackgrounds.push(foundBackgroundInDB);
        }
    }
    catch (err) {
        deleteFiles(filesArray);
        return next(new http_error_1.default("Nie udało się zweryfikować czy pliki tła już istnieją, spróbuj ponownie.", 500));
    }
    if (foundBackgrounds.length > 0) {
        const filesToBeProcessedFurtherArray = [];
        const fileDuplicatesArray = [];
        const duplicateImagesNames = foundBackgrounds.map((background) => background.backgroundImageName);
        filesArray.forEach((file) => {
            const imageName = file.originalname.split(".")[0];
            duplicateImagesNames.includes(imageName)
                ? fileDuplicatesArray.push(file)
                : filesToBeProcessedFurtherArray.push(file);
        });
        finalUnprocessedImagesArray.push(...fileDuplicatesArray.map((image) => ({
            fileName: image.originalname,
            error: app_types_1.IImageProcessingError.NAME_ALREADY_IN_DATABASE,
        })));
        filesArray = filesArray.filter((image) => !fileDuplicatesArray.includes(image));
        //delete duplicates and send response if no files left
        deleteFiles(fileDuplicatesArray);
        if (filesArray.length < 1) {
            return next(new http_error_1.default("Przesłane pliki tła o takiej/takich nazwach już istnieją w bazie danych.", 500));
        }
    }
    //create all thumbnails
    const { processedImages, unprocessedImages } = yield ImageFilesUtils_1.default.createThumbnails(filesArray);
    //delete images if their thumbnails were unprocessed
    if (unprocessedImages.length > 0) {
        deleteFiles(unprocessedImages);
        finalUnprocessedImagesArray.push(...unprocessedImages.map((image) => ({
            fileName: image.originalname,
            error: app_types_1.IImageProcessingError.THUMBNAIL_CREATION_FAILURE,
        })));
    }
    //create BackgroundImagesObjects
    const backgroundImagesObjects = processedImages.map((image) => {
        return new BackgroundImage_1.default({
            backgroundImageName: image.originalname.split(".")[0],
            backgroundImage: image.path,
            backgroundImageThumbnail: image.thumbnailPath,
        });
    });
    let result;
    try {
        result = yield BackgroundImage_1.default.insertMany(backgroundImagesObjects);
        finalProcessedImagesArray.push(...result);
    }
    catch (error) {
        console.error(error);
        deleteFiles(processedImages);
        yield BackgroundImage_1.default.deleteMany(backgroundImagesObjects);
        finalUnprocessedImagesArray.push(...processedImages.map((image) => ({
            fileName: image.originalname,
            error: app_types_1.IImageProcessingError.DATABASE_CREATION_DOCUMENT_ERROR,
        })));
    }
    res.status(finalProcessedImagesArray.length > 0 ? 201 : 500).json({
        processedImages: finalProcessedImagesArray,
        unprocessedImages: finalUnprocessedImagesArray,
    });
});
exports.createBackgroundImages = createBackgroundImages;
const updateBackgroundImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(500).json({ message: "updateBackgroundImage - not Implemented" });
});
exports.updateBackgroundImage = updateBackgroundImage;
const deleteBackgroundImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id)) {
        return next(new http_error_1.default("Wymagany ID pliku tła.", 400));
    }
    if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
        return next(new http_error_1.default("Podane ID ma złą formę.", 400));
    }
    let filesDeletedResponse;
    try {
        const backgroundImage = yield BackgroundImage_1.default.findOne({
            _id: req.params.id,
        }).exec();
        if (!backgroundImage) {
            return next(new http_error_1.default(`Nie ma tła o ID: ${req.params.id}.`, 204));
        }
        //deleting file
        try {
            filesDeletedResponse = ImageFilesUtils_1.default.deleteFilesWithPathsArrayArgument([
                backgroundImage.backgroundImage,
                backgroundImage.backgroundImageThumbnail,
            ]);
        }
        catch (error) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie plików graficznych nie powiodło się.`, 500));
        }
        console.log({ filesDeletedResponse });
        //if couldn't delete file for any reason - inform that in response
        if (filesDeletedResponse.includes("FILE_UNDELETED")) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku tła nie powiodło się.`, 500));
        }
        //response
        const result = yield backgroundImage.deleteOne();
        res.json(result);
    }
    catch (error) {
        return next(new http_error_1.default(`Błąd serwera, połączenie z bazą danych nie powiodło się.`, 500));
    }
});
exports.deleteBackgroundImage = deleteBackgroundImage;
////private
function deleteFiles(arrayOfFiles) {
    const result = ImageFilesUtils_1.default.deleteFilesWithFilesArrayArgument(arrayOfFiles);
    return result;
}
