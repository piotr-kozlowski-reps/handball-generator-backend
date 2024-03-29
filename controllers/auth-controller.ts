import bcrypt from "bcryptjs";
import User from "../models/User";
import HttpError from "../utils/http-error";
import jwt from "jsonwebtoken";
import EnvironmentalVariablesUtil from "../utils/EnvironmentalVariablesUtils";
import { Request, Response, NextFunction } from "express";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // /** Encrypted password generator for temporary password*/
  // //start
  //userName: obslugameczu
  //password : obslugameczuhaslo1
  // const desiredPassword = "obslugameczuhaslo1";
  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(desiredPassword, 12);
  //   console.log(hashedPassword);
  // } catch (error) {
  //   console.error(error);
  // }
  // //end

  const { userName, password } = req.body;

  if (!userName || !password)
    return res.status(400).json({ message: "Użytkownik i hasło są wymagane." });

  let foundUser;
  try {
    foundUser = await User.findOne({ userName: userName });
  } catch (err) {
    return next(
      new HttpError("Nie udało się zalogować, spróbuj ponownie.", 500)
    );
  }
  if (!foundUser) {
    return next(new HttpError("Niepoprawne dane, spróbuj raz jeszcze.", 401)); //unauthorized
  }

  //password check
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, foundUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Nieoczekiwany błąd. Sprawdź swoje dane logowania i spróbuj ponownie.",
        500
      )
    );
  }
  if (!isValidPassword) {
    return next(new HttpError("Niepoprawne dane, spróbuj raz jeszcze.", 403));
  }

  ////final response
  const roles = Object.values(foundUser.roles).filter(Boolean);

  //create JWTs
  let accessToken;
  let refreshToken;

  try {
    accessToken = jwt.sign(
      {
        UserInfo: {
          userName,
          roles,
        },
      },
      EnvironmentalVariablesUtil.getAccessTokenSecret(),
      { expiresIn: EnvironmentalVariablesUtil.getAccessTokenExpiration() }
    );
    refreshToken = jwt.sign(
      { userName: foundUser.userName },
      EnvironmentalVariablesUtil.getRefreshTokenSecret(),
      {
        expiresIn: EnvironmentalVariablesUtil.getRefreshTokenExpiration(),
      }
    );
  } catch (err) {
    return next(
      new HttpError(
        "Nieoczekiwany błąd. Sprawdź swoje dane logowania i spróbuj ponownie.",
        500
      )
    );
  }

  //update user in DB with refreshToken
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  // console.log(result);

  //secure cookie set
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true, //TODO: turn on for Browsers / off for ThunderClient
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  //final response
  res.json({ roles, accessToken });
};
