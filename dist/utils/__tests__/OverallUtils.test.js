"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OverallUtils_1 = __importDefault(require("../OverallUtils"));
describe("OverallUtils.test", () => {
    it("checkIfArrayHasDuplicates", () => {
        let result = OverallUtils_1.default.checkIfArrayHasDuplicates([
            "aa",
            "bb",
            "aa",
            "bc",
        ]);
        expect(result).toBeTruthy();
        result = OverallUtils_1.default.checkIfArrayHasDuplicates([1, 2, 3, 4]);
        expect(result).toBeFalsy();
        result = OverallUtils_1.default.checkIfArrayHasDuplicates(["aa", "bb", , "bc"]);
        expect(result).toBeFalsy();
    });
});
