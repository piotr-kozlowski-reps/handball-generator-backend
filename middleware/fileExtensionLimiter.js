const path = require("path");
const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");

const fileExtensionLimiter = (allowedExtensionsArray) => {
  return (req, res, next) => {
    const file = req.file;

    const fileExtension = path.extname(file.originalname);
    const isAllowed = allowedExtensionsArray.includes(fileExtension);

    if (!isAllowed) {
      deleteFile(req.file.path);
      return next(
        new HttpError(
          `Obrazek musi być plikiem o rozszerzeniu: ${allowedExtensionsArray.toString()}`,
          400
        )
      );
    }

    next();
  };
};

module.exports = fileExtensionLimiter;
