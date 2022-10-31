const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/http-error");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return next(new HttpError("Nie masz dostępu do tych zasobów.", 401));

  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next(new HttpError("Token jest niepoprawny", 403));
    req.user = decoded.UserInfo.userName;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
