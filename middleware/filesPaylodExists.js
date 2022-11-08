const HttpError = require("../helpers/http-error");

const filesPayloadExists = (req, res, next) => {
  if (!req.file) {
    return next(new HttpError("Brak pliku graficznego.", 400));
  }
  next();
};

module.exports = filesPayloadExists;
