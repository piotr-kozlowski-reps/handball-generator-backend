const sharp = require("sharp");
const path = require("path");
const HttpError = require("./http-error");

const createThumbnails = async (filePaths) => {
  const result = [];
  try {
    for (let i = 0; i < filePaths.length; i++) {
      const resultThumbnailInfo = await createThumbnail(filePaths[i].path);
      result.push(resultThumbnailInfo);
    }
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
  const thumbnailPath = `${directoriesPath}${fileNameWithoutExtension}__thumbnail.jpg`;

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
      .toFile(thumbnailPath);
  } catch (error) {
    console.error(error);
  }

  return { newThumbnail, thumbnailPath };
};

module.exports = { createThumbnails };
