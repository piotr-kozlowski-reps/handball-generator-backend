const path = require("path");
const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");

const fileExtensionLimiter = (allowedExtensionsArray) => {
  return (req, res, next) => {
    const file = req.file;
    const files = req.files;

    console.log({ file });
    console.log({ files });

    let isAllowed = true;
    if (file) {
      const fileExtension = path.extname(file.originalname);
      isAllowed = allowedExtensionsArray.includes(fileExtension);
    }

    if (files) {
      files.forEach((file) => {
        const fileExtension = path.extname(file.originalname);
        isAllowed = isAllowed && allowedExtensionsArray.includes(fileExtension);
      });
    }

    //TODO: deleteFile
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
