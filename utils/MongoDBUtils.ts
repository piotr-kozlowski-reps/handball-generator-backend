export default class MongoDBUtils {
  ////MongoDB utils

  /** checks if mongoDB ID has 24 characters length - if not then it's bad */
  static checkMongoIdLength = (id: string) => {
    return id.length === 24;
  };
}
