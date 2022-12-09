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
exports.getAllTeams = void 0;
// const deleteFile = require("../utils/deleteFIle");
const http_error_1 = __importDefault(require("../utils/http-error"));
const Team_1 = __importDefault(require("../models/Team"));
// const { checkMongoIdLength } = require("../utils/checkMongoIDLength");
const getAllTeams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let teams;
    try {
        teams = yield Team_1.default.find();
    }
    catch (err) {
        return next(new http_error_1.default("Błąd serwera, spróbuj ponownie.", 500));
    }
    res.status(200).json(teams);
});
exports.getAllTeams = getAllTeams;
// const getTeam = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagane ID drużyny.", 400));
//   }
//   if (!checkMongoIdLength(req.params.id)) {
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
// const createTeam = async (req, res, next) => {
//   const { teamName, place } = req.body;
//   if (!teamName)
//     return res.status(400).json({ message: "Nazwa drużyny jest wymagana." });
//   if (!place)
//     return res
//       .status(400)
//       .json({ message: "Lokalizacja drużyny jest wymagana." });
//   let foundTeam;
//   try {
//     foundTeam = await Team.findOne({ teamName: teamName });
//   } catch (err) {
//     return next(
//       new HttpError(
//         "Nie udało się zweryfikować czy drużyna już istnieje, spróbuj ponownie.",
//         500
//       )
//     );
//   }
//   if (foundTeam) {
//     deleteFile(req.file.path);
//     return next(new HttpError("Drużyna już istnieje.", 400));
//   }
//   const newTeam = new Team({
//     teamName,
//     place,
//     teamCrestImage: req.file.path,
//   });
//   let result;
//   try {
//     result = await newTeam.save();
//     console.log(result);
//   } catch (err) {
//     return next(
//       new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
//     );
//   }
//   //final response
//   res.status(201).json({ result });
// };
// const updateTeam = async (req, res, next) => {
//   res.status(200).json({ message: "updateTeam" });
// };
// const deleteTeam = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagany ID drużyny.", 400));
//   }
//   if (!checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }
//   let fileDeletedResponse;
//   try {
//     const team = await Team.findOne({ _id: req.params.id }).exec();
//     if (!team) {
//       return next(new HttpError(`Nie ma drużyny o ID: ${req.params.id}.`, 204));
//     }
//     //delete file
//     try {
//       fileDeletedResponse = deleteFile(team.teamCrestImage);
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
//     const result = await team.deleteOne(); //{ _id: req.body.id }
//     res.json(result);
//   } catch (error) {
//     console.log(error);
//     return next(
//       new HttpError(`Błąd serwera, skasowanie drużyny nie powiodło się.`, 500)
//     );
//   }
// };
// module.exports = { getAllTeams, createTeam, getTeam, updateTeam, deleteTeam };
