export default class OverallUtils {
  ////overall utils

  /** checks if array of any type has duplicates */
  static checkIfArrayHasDuplicates<T>(providedArray: T[]): boolean {
    return new Set(providedArray).size !== providedArray.length;
  }

  ////privates
}
