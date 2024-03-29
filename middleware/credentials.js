const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    console.log("added credentials");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", true);
  }
  next();
};

module.exports = credentials;
