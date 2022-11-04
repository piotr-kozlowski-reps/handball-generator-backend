const { logEvents } = require("./logEvents");
const { ERROR_LOGGER } = require("../config/loggerFilesNames");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, ERROR_LOGGER);
  console.error(err.stack);
  if (res.headerSent) return next(err);
  res.status(err.code || 500).send(err.message || "An unknown error occurred.");
};

module.exports = errorHandler;
