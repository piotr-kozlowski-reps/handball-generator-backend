const { checkMongoIdLength } = require("../checkMongoIDLength");

describe("checkMongoIdLength", () => {
  it("should return true when mongoDB id length is proper (24 characters) ", () => {
    let result = checkMongoIdLength("dfgd");
    expect(result).toEqual(false);

    result = checkMongoIdLength("");
    expect(result).toEqual(false);

    result = checkMongoIdLength("sdfvwdvsrtgb56yhbv546hv456bv54h54");
    expect(result).toEqual(false);

    result = checkMongoIdLength("63638bf16fb001fc5f038b24");
    expect(result).toEqual(true);

    result = checkMongoIdLength("636a7c134076a593f37ee5a6");
    expect(result).toEqual(true);
  });
});
