const sharp = require("sharp");
const deleteFile = require("../utils/deleteFIle");
const HttpError = require("../utils/http-error");

const fileResolutionLimiter = async (req, res, next) => {
  const image = await sharp(req.file.path);
  const metadata = await image.metadata();

  if (
    metadata.width > process.env.TEAMCREST_WIDTH_LIMITER ||
    metadata.height > process.env.TEAMCREST_HEIGHT_LIMITER
  ) {
    deleteFile(req.file.path);
    return next(
      new HttpError(
        `Herb ma zbyt duże wymiary.\nDopuszczalna szerokość pliku to: ${process.env.TEAMCREST_WIDTH_LIMITER} px.\nDopuszczalna wysokość pliku to: ${process.env.TEAMCREST_HEIGHT_LIMITER} px.`,
        400
      )
    );
  }

  next();
};
module.exports = fileResolutionLimiter;
