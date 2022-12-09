"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMongoIdLength = void 0;
/** checks if mongoDB ID has 24 characters length - if not then it's bad */
const checkMongoIdLength = (id) => {
    return id.length === 24;
};
exports.checkMongoIdLength = checkMongoIdLength;
