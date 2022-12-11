"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OverallUtils {
    ////overall utils
    /** checks if array of any type has duplicates */
    static checkIfArrayHasDuplicates(providedArray) {
        return new Set(providedArray).size !== providedArray.length;
    }
}
exports.default = OverallUtils;
