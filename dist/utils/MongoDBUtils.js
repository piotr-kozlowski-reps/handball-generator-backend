"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoDBUtils {
}
exports.default = MongoDBUtils;
////MongoDB utils
/** checks if mongoDB ID has 24 characters length - if not then it's bad */
MongoDBUtils.checkMongoIdLength = (id) => {
    return id.length === 24;
};
