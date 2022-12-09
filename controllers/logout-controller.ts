import User from "../models/User";
import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  console.log("cookies: ", cookies);
  if (!cookies?.jwt)
    return next(res.status(204).json({ message: "Nie jesteś zalogowany." })); //No content
  const refreshToken = cookies.jwt;

  /** is refresh token in DB */
  let foundUser;
  try {
    foundUser = await User.findOne({ refreshToken });
  } catch (err) {
    return next(new HttpError("Coś poszło nie tak, spróbuj ponownie.", 500));
  }
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
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
      sameSite: "none",
      secure: true, //TODO: turn on for Browsers / off for ThunderClient
    });
    res.status(204).json({ message: "Nie jesteś zalogowany." });
  } catch (err) {
    return next(new HttpError("Coś poszło nie tak, spróbuj ponownie.", 500));
  }
};
