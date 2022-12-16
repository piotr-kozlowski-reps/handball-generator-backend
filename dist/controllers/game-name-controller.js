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
exports.deleteGameName = exports.updateGameName = exports.createGameName = exports.getGameName = exports.getAllGameNames = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
const GameName_1 = __importDefault(require("../models/GameName"));
const MongoDBUtils_1 = __importDefault(require("../utils/MongoDBUtils"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
const general_crud_1 = require("../utils/general-crud");
const getAllGameNames = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchAll_General)(GameName_1.default, req, res, next);
});
exports.getAllGameNames = getAllGameNames;
const getGameName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchOne_General)(GameName_1.default, req, res, next);
});
exports.getGameName = getGameName;
const createGameName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filesArray = req.files;
    const { gameName } = req.body;
    // if no fields values - send error response
    if (!gameName)
        return next(new http_error_1.default("Nazwa rozgrywek jest wymagana.", 400));
    if (!filesArray || filesArray.length < 1) {
        return next(new http_error_1.default("Musisz przesłać plik rozgrywek.", 400));
    }
    if (filesArray.length > 1) {
        return next(new http_error_1.default("Nie możesz przesłać więcej niż jeden plik rozgrywek.", 400));
    }
    console.log(filesArray);
    //check if gameName with this gameName.Name already exist in Database
    let foundGameName;
    try {
        foundGameName = yield GameName_1.default.findOne({
            gameName: gameName,
        });
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało się zweryfikować czy nazwa rozgrywek już istnieje, spróbuj ponownie.", 500));
    }
    if (foundGameName) {
        ImageFilesUtils_1.default.deleteFiles([filesArray[0].path]);
        return next(new http_error_1.default("Nazwa rozgrywek już istnieje.", 400));
    }
    // create new Team
    const newGameName = new GameName_1.default({
        gameName,
        gameImage: filesArray[0].path,
    });
    let result;
    try {
        result = yield newGameName.save();
        console.log({ result });
    }
    catch (err) {
        console.error(err);
        return next(new http_error_1.default("Nie udało zapisać danych w bazie, spróbuj ponownie.", 500));
    }
    //final response
    res.status(201).json({ result });
});
exports.createGameName = createGameName;
const updateGameName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("Not implemented.");
    res.status(200).json({ message: "updateGameName" });
});
exports.updateGameName = updateGameName;
const deleteGameName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return next(new http_error_1.default("Wymagany ID rodzaju rozgrywek.", 400));
    }
    if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
        return next(new http_error_1.default("Podane ID ma złą formę.", 400));
    }
    let filesDeletedResponse;
    try {
        const gameName = yield GameName_1.default.findOne({
            _id: req.params.id,
        }).exec();
        if (!gameName) {
            return next(new http_error_1.default(`Nie ma rozgrywek o ID: ${req.params.id}.`, 204));
        }
        //deleting file
        try {
            filesDeletedResponse = ImageFilesUtils_1.default.deleteFiles([gameName.gameImage]);
        }
        catch (error) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku graficznego nie powiodło się.`, 500));
        }
        console.log({ filesDeletedResponse });
        //if couldn't delete file for any reason - inform that in response
        if (filesDeletedResponse.includes("FILE_UNDELETED")) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku graficznego rozgrywek nie powiodło się.`, 500));
        }
        const result = yield gameName.deleteOne();
        res.json(result);
    }
    catch (error) {
        return next(new http_error_1.default(`Błąd serwera, połączenie z bazą danych nie powiodło się.`, 500));
    }
});
exports.deleteGameName = deleteGameName;
/////////////////////////////// OLD
// const getAllGameNames = async (req, res, next) => {
//   let gameNames;
//   try {
//     gameNames = await GameName.find();
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   res.status(200).json(gameNames);
// };
// const getGameName = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagany ID rodzaju rozgrywek.", 400));
//   }
//   if (!checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }
//   let gameName;
//   try {
//     gameName = await GameName.findOne({ _id: req.params.id });
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   if (!gameName) {
//     return next(new HttpError("Nie ma rozgrywek o takim ID.", 204));
//   }
//   res.status(200).json({ gameName });
// };
// const createGameName = async (req, res, next) => {
//   const { gameName } = req.body;
//   if (!gameName)
//     return res.status(400).json({ message: "Nazwa rozgrywek jest wymagana." });
//   let foundGameName;
//   try {
//     foundGameName = await GameName.findOne({
//       gameName: gameName,
//     });
//   } catch (err) {
//     return next(
//       new HttpError(
//         "Nie udało się zweryfikować czy nazwa rozgrywek już istnieje, spróbuj ponownie.",
//         500
//       )
//     );
//   }
//   if (foundGameName) {
//     deleteFile(req.file.path);
//     return next(new HttpError("Nazwa rozgrywek już istnieje.", 400));
//   }
//   const newGameName = new GameName({
//     gameName,
//     gameImage: req.file.path,
//   });
//   console.log(newGameName);
//   let result;
//   try {
//     result = await newGameName.save();
//     console.log({ result });
//   } catch (err) {
//     console.error(err);
//     return next(
//       new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
//     );
//   }
//   //final response
//   res.status(201).json({ result });
// };
// const updateGameName = async (req, res, next) => {
//   res.status(200).json({ message: "updateGameName" });
// };
// const deleteGameName = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagany ID rodzaju rozgrywek.", 400));
//   }
//   if (!checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }
//   let fileDeletedResponse;
//   try {
//     const gameName = await GameName.findOne({
//       _id: req.params.id,
//     }).exec();
//     if (!gameName) {
//       return next(
//         new HttpError(`Nie ma rozgrywek o ID: ${req.params.id}.`, 204)
//       );
//     }
//     try {
//       fileDeletedResponse = deleteFile(gameName.gameImage);
//     } catch (error) {
//       return next(
//         new HttpError(
//           `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
//           500
//         )
//       );
//     }
//     if (fileDeletedResponse === DELETE_FILE_RESPONSE.fileUnDeleted) {
//       return next(
//         new HttpError(
//           `Błąd serwera, skasowanie pliku graficznego rozgrywek nie powiodło się.`,
//           500
//         )
//       );
//     }
//     const result = await gameName.deleteOne();
//     res.json(result);
//   } catch (error) {
//     return next(
//       new HttpError(`Błąd serwera, skasowanie rozgrywek nie powiodło się.`, 500)
//     );
//   }
// };
