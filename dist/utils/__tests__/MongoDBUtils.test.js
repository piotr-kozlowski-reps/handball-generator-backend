"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDBUtils_1 = __importDefault(require("../MongoDBUtils"));
describe("checkMongoIdLength", () => {
    it("should return true when mongoDB id length is proper (24 characters) ", () => {
        let result = MongoDBUtils_1.default.checkMongoIdLength("dfgd");
        expect(result).toEqual(false);
        result = MongoDBUtils_1.default.checkMongoIdLength("");
        expect(result).toEqual(false);
        result = MongoDBUtils_1.default.checkMongoIdLength("sdfvwdvsrtgb56yhbv546hv456bv54h54");
        expect(result).toEqual(false);
        result = MongoDBUtils_1.default.checkMongoIdLength("63638bf16fb001fc5f038b24");
        expect(result).toEqual(true);
        result = MongoDBUtils_1.default.checkMongoIdLength("636a7c134076a593f37ee5a6");
        expect(result).toEqual(true);
    });
});
