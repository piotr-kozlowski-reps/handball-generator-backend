import bcrypt from "bcryptjs";
import User from "../models/User";
import HttpError from "../utils/http-error";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TUser } from "../utils/app.types";
import EnvironmentalVariablesUtil from "../utils/EnvironmentalVariablesUtils";

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.log("nie ma cookiesa ");
    return next(new HttpError("Nie jesteś zalogowany.", 401));
  }

  const refreshToken = cookies.jwt;

  /** Find user in DB via refreshToken */
  let foundUser: TUser | null;
  try {
    foundUser = await User.findOne({ refreshToken });
  } catch (err) {
    return next(new HttpError("Nie masz autoryzacji, spróbuj ponownie.", 500));
  }
  if (!foundUser) return next(new HttpError("Dostęp zabroniony.", 403)); //forbidden

  /** Evaluate jwt */
  jwt.verify(
    refreshToken,
    EnvironmentalVariablesUtil.getRefreshTokenSecret(),
    (err: any, decoded: any) => {
      if (err || !foundUser || foundUser.userName !== decoded.userName)
        return next(new HttpError("Dostęp zabroniony.", 403)); //forbidden

      const roles = Object.values(foundUser.roles).filter(Boolean);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            userName: decoded.userName,
            roles,
          },
        },
        EnvironmentalVariablesUtil.getAccessTokenSecret(),
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );

      //final response
      res.json({ roles, accessToken });
    }
  );
};
