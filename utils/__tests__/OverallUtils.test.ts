import EnvironmentalVariablesUtil from "../EnvironmentalVariablesUtils";
import OverallUtils from "../OverallUtils";

describe("OverallUtils.test", () => {
  it("checkIfArrayHasDuplicates", () => {
    let result = OverallUtils.checkIfArrayHasDuplicates([
      "aa",
      "bb",
      "aa",
      "bc",
    ]);
    expect(result).toBeTruthy();

    result = OverallUtils.checkIfArrayHasDuplicates([1, 2, 3, 4]);
    expect(result).toBeFalsy();

    result = OverallUtils.checkIfArrayHasDuplicates(["aa", "bb", , "bc"]);
    expect(result).toBeFalsy();
  });
});
