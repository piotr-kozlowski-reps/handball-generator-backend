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
exports.deleteSponsorsBar = exports.updateSponsorsBar = exports.createSponsorsBar = exports.getSponsorsBar = exports.getAllSponsorsBars = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
const SponsorsBar_1 = __importDefault(require("../models/SponsorsBar"));
const MongoDBUtils_1 = __importDefault(require("../utils/MongoDBUtils"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
const general_crud_1 = require("../utils/general-crud");
const getAllSponsorsBars = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchAll_General)(SponsorsBar_1.default, req, res, next);
});
exports.getAllSponsorsBars = getAllSponsorsBars;
const getSponsorsBar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, general_crud_1.fetchOne_General)(SponsorsBar_1.default, req, res, next);
});
exports.getSponsorsBar = getSponsorsBar;
const createSponsorsBar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filesArray = req.files;
    const { barName } = req.body;
    // if no fields values - send error response
    if (!barName)
        return next(new http_error_1.default("Nazwa belki sponsorów jest wymagana.", 400));
    if (!filesArray || filesArray.length < 1) {
        return next(new http_error_1.default("Musisz przesłać plik belki sponsorów.", 400));
    }
    if (filesArray.length > 1) {
        return next(new http_error_1.default("Nie możesz przesłać więcej niż jeden plik belki sponsorów.", 400));
    }
    console.log(filesArray);
    //check team with this teamName exist already in Database
    let foundSponsorsBar;
    try {
        foundSponsorsBar = yield SponsorsBar_1.default.findOne({ barName: barName });
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało się zweryfikować czy belka sponsorów już istnieje, spróbuj ponownie.", 500));
    }
    if (foundSponsorsBar) {
        ImageFilesUtils_1.default.deleteFiles([filesArray[0].path]);
        return next(new http_error_1.default("Belka sponsorów o takiej nazwie już istnieje.", 400));
    }
    // create new Sponsors Bar
    const newSponsorBar = new SponsorsBar_1.default({
        barName,
        sponsorsBarImage: filesArray[0].path,
    });
    let result;
    try {
        result = yield newSponsorBar.save();
        console.log(result);
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało zapisać danych, spróbuj ponownie.", 500));
    }
    //final response
    res.status(201).json({ result });
});
exports.createSponsorsBar = createSponsorsBar;
const updateSponsorsBar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("Not implemented.");
    res.status(200).json({ message: "updateSponsorsBar" });
});
exports.updateSponsorsBar = updateSponsorsBar;
const deleteSponsorsBar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return next(new http_error_1.default("Wymagany ID paska sponsorów.", 400));
    }
    if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
        return next(new http_error_1.default("Podane ID ma złą formę.", 400));
    }
    let filesDeletedResponse;
    try {
        const sponsorBar = yield SponsorsBar_1.default.findOne({ _id: req.params.id }).exec();
        if (!sponsorBar) {
            return next(new http_error_1.default(`Nie ma paska sponsorów o ID: ${req.params.id}.`, 204));
        }
        //deleting file
        try {
            filesDeletedResponse = ImageFilesUtils_1.default.deleteFiles([
                sponsorBar.sponsorsBarImage,
            ]);
        }
        catch (error) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie plików graficznych nie powiodło się.`, 500));
        }
        console.log({ filesDeletedResponse });
        //if couldn't delete file for any reason - inform that in response
        if (filesDeletedResponse.includes("FILE_UNDELETED")) {
            return next(new http_error_1.default(`Błąd serwera, skasowanie pliku paska sponsorów nie powiodło się.`, 500));
        }
        ////response
        const result = yield sponsorBar.deleteOne();
        res.json(result);
    }
    catch (error) {
        return next(new http_error_1.default(`Błąd serwera, połączenie z bazą danych nie powiodło się.`, 500));
    }
});
exports.deleteSponsorsBar = deleteSponsorsBar;
/////////////////////////////// OLD
// const getAllSponsorsBars = async (req, res, next) => {
//   let sponsorsBars;
//   try {
//     sponsorsBars = await SponsorsBar.find();
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   console.log(sponsorsBars);
//   res.status(200).json(sponsorsBars);
// };
// const getSponsorsBar = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagane ID belki sponsorów.", 400));
//   }
//   if (!checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }
//   let sponsorsBar;
//   try {
//     sponsorsBar = await SponsorsBar.findOne({ _id: req.params.id });
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }
//   if (!sponsorsBar) {
//     return next(new HttpError("Nie ma belki sponsorów o takim ID.", 204));
//   }
//   res.status(200).json({ sponsorsBar });
// };
