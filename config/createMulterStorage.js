const path = require("path");
const { format } = require("date-fns");

const createMulterStorage = (multer) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("originalUrl: ", req.originalUrl);
      switch (req.originalUrl) {
        case "/api/team":
          cb(null, path.join("images", "team-crests"));
          return;
        case "/api/sponsors-bar":
          cb(null, path.join("images", "sponsors-bars"));
          return;
        case "/api/background-image":
          cb(null, path.join("images", "background-images"));
          return;
        case "/api/game-name":
          cb(null, path.join("images", "game-names"));
          return;
      }
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, createFileName(file));
    },
  });
};

//utils
function createFileName(file) {
  const date = format(Date.now(), "yyyyMMdd-HHmmss");

  return `${file.originalname.split(".")[0]}___${date}${path.extname(
    file.originalname
  )}`;
}

module.exports = { createFileName, createMulterStorage };
