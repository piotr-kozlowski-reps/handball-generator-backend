const bcrypt = require("bcryptjs");
const User = require("../models/User");
const HttpError = require("../helpers/http-error");
const jwt = require("jsonwebtoken");

const refreshTokenHandler = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.log("nie ma cookiesa ");
    return next(new HttpError("Nie jesteś zalogowany.", 401));
  }

  const refreshToken = cookies.jwt;

  /** Find user in DB via refreshToken */
  let foundUser;
  try {
    foundUser = await User.findOne({ refreshToken });
  } catch (err) {
    return next(new HttpError("Nie masz autoryzacji, spróbuj ponownie.", 500));
  }
  if (!foundUser) return next(new HttpError("Dostęp zabroniony.", 403)); //forbidden

  /** Evaluate jwt */
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.userName !== decoded.userName)
      return next(new HttpError("Dostęp zabroniony.", 403)); //forbidden

    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userName: decoded.userName,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );

    //final response
    res.json({ roles, accessToken });
  });
};

module.exports = { refreshTokenHandler };
