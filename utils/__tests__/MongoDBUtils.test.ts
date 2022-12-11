import MongoDBUtils from "../MongoDBUtils";

describe("checkMongoIdLength", () => {
  it("should return true when mongoDB id length is proper (24 characters) ", () => {
    let result = MongoDBUtils.checkMongoIdLength("dfgd");
    expect(result).toEqual(false);

    result = MongoDBUtils.checkMongoIdLength("");
    expect(result).toEqual(false);

    result = MongoDBUtils.checkMongoIdLength(
      "sdfvwdvsrtgb56yhbv546hv456bv54h54"
    );
    expect(result).toEqual(false);

    result = MongoDBUtils.checkMongoIdLength("63638bf16fb001fc5f038b24");
    expect(result).toEqual(true);

    result = MongoDBUtils.checkMongoIdLength("636a7c134076a593f37ee5a6");
    expect(result).toEqual(true);
  });
});
