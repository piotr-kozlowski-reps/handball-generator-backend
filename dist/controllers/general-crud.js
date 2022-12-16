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
exports.fetchOne_General = exports.fetchAll_General = void 0;
const http_error_1 = __importDefault(require("../utils/http-error"));
const MongoDBUtils_1 = __importDefault(require("../utils/MongoDBUtils"));
const fetchAll_General = (model, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    getAllItems(req, res, next);
});
exports.fetchAll_General = fetchAll_General;
const fetchOne_General = (model, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new http_error_1.default("ID jest wymagane.", 400));
        }
        if (!MongoDBUtils_1.default.checkMongoIdLength(req.params.id)) {
            return next(new http_error_1.default("Podane ID ma złą formę.", 400));
        }
        let result;
        try {
            result = yield model.findOne({ _id: req.params.id });
        }
        catch (err) {
            return next(new http_error_1.default("Błąd serwera, spróbuj ponownie.", 500));
        }
        if (!result) {
            return next(new http_error_1.default("Nie ma żadnych informacji dla przekazanaego ID.", 204));
        }
        res.status(200).json(result);
    });
    getItem(req, res, next);
});
exports.fetchOne_General = fetchOne_General;
