const createMulterStorage = require("../createMulterStorage");

describe("createMulterStorage", () => {
  it("should create file name with format: filename___YYYYMMDD-HHMMSS.extension", () => {
    const file = {
      fieldname: "teamCrest",
      originalname: "gornik-logo-01.png",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "images\\team-crest",
      filename: "1667406024711.png",
      path: "images\\team-crest\\1667406024711.png",
      size: 11148,
    };
    jest.spyOn(global.Date, "now").mockImplementationOnce(() => {
      return new Date("2022-11-02T22:25:05");
    });
    const result = createMulterStorage.createFileName(file);

    expect(result).toEqual("gornik-logo-01___20221102-222505.png");
  });
});
