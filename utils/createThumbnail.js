const createThumbnail = (filePath) => {
  console.log(filePath);
  return filePath + "__thumbnail";
};

module.exports = { createThumbnail };
