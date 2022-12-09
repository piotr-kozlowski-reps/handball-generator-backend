/** checks if mongoDB ID has 24 characters length - if not then it's bad */
export const checkMongoIdLength = (id: string) => {
  return id.length === 24;
};
