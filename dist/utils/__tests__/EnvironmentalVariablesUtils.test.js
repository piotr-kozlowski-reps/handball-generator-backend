"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnvironmentalVariablesUtils_1 = __importDefault(require("../EnvironmentalVariablesUtils"));
describe("EnvironmentalVariablesUtils.tests", () => {
    it("checkIfStringValueIsInteger", () => {
        let result = EnvironmentalVariablesUtils_1.default.checkIfStringValueIsInteger("1000");
        expect(result).toBeTruthy();
        result = EnvironmentalVariablesUtils_1.default.checkIfStringValueIsInteger("0");
        expect(result).toBeFalsy();
        result = EnvironmentalVariablesUtils_1.default.checkIfStringValueIsInteger("dsfvsdf");
        expect(result).toBeFalsy();
    });
    // it("should  create thumbnail and return it's new path (with __thumnbnail added) ", async () => {
    //   let result1 = await createThumbnails([
    //     "images\\background-images\\sklad_uklad_lista_wyjazd___20221116-131732.jpg",
    //   ]);
    //   expect(result1).toEqual({
    //     newThumbnail: undefined,
    //     thumbnailName:
    //       "images\\background-images\\sklad_uklad_lista_wyjazd___20221116-131732__thumbnail.jpg",
    //   });
    //   const result2 = await createThumbnail(
    //     "images\\background-images\\jakasNazwa___20221116-131732.png"
    //   );
    //   expect(result2).toEqual({
    //     newThumbnail: undefined,
    //     thumbnailName:
    //       "images\\background-images\\jakasnazwa___20221116-131732__thumbnail.jpg",
    //   });
    // });
});
