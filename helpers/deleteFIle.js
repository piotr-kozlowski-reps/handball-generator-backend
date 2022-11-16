const fs = require("fs");
const { logEvents } = require("../middleware/logEvents");
const { ERROR_LOGGER } = require("../config/loggerFilesNames");
const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");

const deleteFile = (filePath) => {
  console.log(`deleting file: ${filePath}`);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return DELETE_FILE_RESPONSE.fileDeleted;
    } catch (err) {
      logEvents(`${err.name}: ${err.message}`, ERROR_LOGGER);
      return DELETE_FILE_RESPONSE.fileUnDeleted;
    }
  }

  return DELETE_FILE_RESPONSE.fileNotFound;
};

module.exports = deleteFile;
