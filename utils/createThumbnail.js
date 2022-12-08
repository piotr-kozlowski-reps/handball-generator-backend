const sharp = require("sharp");
const path = require("path");
const HttpError = require("../helpers/http-error");

const createThumbnails = async (filePaths) => {
  const result = []; //?
  try {
    filePaths.forEach(async (path) => {
      const resultThumbnailInfo = await createThumbnail(path); //?
      console.log(resultThumbnailInfo); //?
      result.push(resultThumbnailInfo);
    });
  } catch (error) {
    console.error(error);
  }
  return result;
};

const createThumbnail = async (filePath) => {
  const fileNameFull = path.basename(filePath);
  const directoriesPath = filePath.replace(fileNameFull, "");
  const extensionName = path.extname(fileNameFull);
  const fileNameWithoutExtension = fileNameFull
    .replace(extensionName, "")
    .toLowerCase();

  //thumbnail name
  const thumbnailName = `${directoriesPath}${fileNameWithoutExtension}__thumbnail.jpg`;

  //create thumbnail
  let newThumbnail;
  try {
    newThumbnail = await sharp(filePath)
      .resize({
        width: 200,
        height: 200,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0.5 },
      })
      .toFormat("jpg", { quality: 30 })
      .toFile(thumbnailName);
  } catch (error) {
    console.error(error);
  }

  return { newThumbnail, thumbnailName };
};

module.exports = { createThumbnails };
