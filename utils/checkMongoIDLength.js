/** checks if mongoDB ID has 24 characters length - if not then it's bad */
const checkMongoIdLength = (id) => {
  return id.length === 24;
};

module.exports = { checkMongoIdLength };
