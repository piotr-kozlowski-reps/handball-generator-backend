const HttpError = require("../utils/http-error");

const filesPayloadExists = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new HttpError("Brak pliku/ów graficznych.", 400));
  }
  next();
};

module.exports = filesPayloadExists;
