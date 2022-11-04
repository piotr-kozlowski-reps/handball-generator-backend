const path = require("path");
const { format } = require("date-fns");

const createMulterStorage = (multer) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("originalUrl: ", req.originalUrl);
      switch (req.originalUrl) {
        case "/api/team":
          cb(null, path.join("images", "team-crest"));
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
