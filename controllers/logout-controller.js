const bcrypt = require("bcryptjs");
const User = require("../models/User");
const HttpError = require("../helpers/http-error");
const jwt = require("jsonwebtoken");

const logoutHandler = async (req, res, next) => {
  const cookies = req.cookies;
  console.log("cokkies: ", cookies);
  if (!cookies?.jwt)
    return next(res.status(204).json({ message: "Nie jesteś zalogowany." })); //No content
  const refreshToken = cookies.jwt;

  console.log("refreshToken: ", refreshToken);

  /** is refresh token in DB */
  let foundUser;
  try {
    foundUser = await User.findOne({ refreshToken });
  } catch (err) {
    return next(new HttpError("Coś poszło nie tak, spróbuj ponownie.", 500));
  }
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return next(res.status(204).json({ message: "Nie jesteś zalogowany." }));
  }

  /** delete refresh token in DB if needed */
  foundUser.refreshToken = "";
  let result;
  try {
    result = await foundUser.save();
    console.log(result);

    /** final response */
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      // secure: true, //TODO: turn on for Browsers / off for ThunderClient
    });
    res.status(204).json({ message: "Nie jesteś zalogowany." });
  } catch (err) {
    return next(new HttpError("Coś poszło nie tak, spróbuj ponownie.", 500));
  }
};

module.exports = { logoutHandler };
