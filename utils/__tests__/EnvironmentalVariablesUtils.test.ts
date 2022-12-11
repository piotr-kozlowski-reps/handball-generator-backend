import EnvironmentalVariablesUtil from "../EnvironmentalVariablesUtils";

describe("EnvironmentalVariablesUtils.tests", () => {
  it("checkIfStringValueIsInteger", () => {
    let result = EnvironmentalVariablesUtil.checkIfStringValueIsInteger("1000");
    expect(result).toBeTruthy();

    result = EnvironmentalVariablesUtil.checkIfStringValueIsInteger("0");
    expect(result).toBeFalsy();

    result = EnvironmentalVariablesUtil.checkIfStringValueIsInteger("dsfvsdf");
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
