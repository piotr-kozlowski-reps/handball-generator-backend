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
exports.deleteTeam = exports.updateTeam = exports.createTeam = exports.getTeam = exports.getAllTeams = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
const Team_1 = __importDefault(require("../models/Team"));
const MongoDBUtils_1 = __importDefault(require("../utils/MongoDBUtils"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
const general_crud_1 = require("../utils/general-crud");
const getAllTeams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchAll_General)(Team_1.default, req, res, next);
});
exports.getAllTeams = getAllTeams;
const getTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchOne_General)(Team_1.default, req, res, next);
});
exports.getTeam = getTeam;
const createTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filesArray = req.files;
    const { teamName, place } = req.body;
    // if no fields values - send error response
    if (!teamName)
        return next(new http_error_1.default("Nazwa drużyny jest wymagana.", 400));
    if (!place)
        return next(new http_error_1.default("Lokalizacja drużyny jest wymagana.", 400));
    if (!filesArray || filesArray.length < 1) {
        return next(new http_error_1.default("Musisz przesłać plik tła.", 400));
    }
    if (filesArray.length > 1) {
        return next(new http_error_1.default("Nie możesz przesłać więcej niż jeden plik tła.", 400));
    }
    console.log(filesArray);
    //check team with this teamName exist already in Database
    let foundTeam;
    try {
        foundTeam = yield Team_1.default.findOne({ teamName: teamName });
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało się zweryfikować czy drużyna już istnieje, spróbuj ponownie.", 500));
    }
    if (foundTeam) {
        ImageFilesUtils_1.default.deleteFiles([filesArray[0].path]);
        return next(new http_error_1.default("Drużyna już istnieje.", 400));
    }
    // create new Team
    const newTeam = new Team_1.default({
        teamName,
        place,
        teamCrestImage: filesArray[0].path,
    });
    let result;
    try {
        result = yield newTeam.save();
        console.log(result);
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało zapisać danych w bazie, spróbuj ponownie.", 500));
    }
    //final response
    res.status(201).json({ result });
});
exports.createTeam = createTeam;
const updateTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("Not implemented.");
    res.status(200).json({ message: "updateTeam" });
});
exports.updateTeam = updateTeam;
const deleteTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return next(new http_error_1.default("Wymagany ID drużyny.", 400));
    }
    if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
        return next(new http_error_1.default("Podane ID ma złą formę.", 400));
    }
    let filesDeletedResponse;
    try {
        const team = yield Team_1.default.findOne({ _id: req.params.id }).exec();
        if (!team) {
            return next(new http_error_1.default(`Nie ma drużyny o ID: ${req.params.id}.`, 204));
        }
        //deleting file
        try {
            filesDeletedResponse = ImageFilesUtils_1.default.deleteFiles([team.teamCrestImage]);
        }
        catch (error) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku graficznego nie powiodło się.`, 500));
        }
        //if couldn't delete file for any reason - inform that in response
        if (filesDeletedResponse.includes("FILE_UNDELETED")) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku tła nie powiodło się.`, 500));
        }
        //response
        const result = yield team.deleteOne();
        res.json(result);
    }
    catch (error) {
        console.log(error);
        return next(new http_error_1.default(`Błąd serwera, połączenie z bazą danych nie powiodło się.`, 500));
    }
});
exports.deleteTeam = deleteTeam;
/////////////////////////////// OLD
// export const getAllTeams = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let teams;
//   try {
//     teams = await Team.find();
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   res.status(200).json(teams);
// };
// export const getTeam = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagane ID drużyny.", 400));
//   }
//   if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }
//   let team;
//   try {
//     team = await Team.findOne({ _id: req.params.id });
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   if (!team) {
//     return next(new HttpError("Nie ma drużyny o takim ID.", 204));
//   }
//   res.status(200).json({ team });
// };
