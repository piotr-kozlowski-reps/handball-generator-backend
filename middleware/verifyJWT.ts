import jwt from "jsonwebtoken";
import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";
import EnvironmentalVariablesUtil from "../utils/EnvironmentalVariablesUtil";

const verifyJWT = (
  req: Request & { user?: string; roles?: number[] },
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    (req.headers.authorization as string) ||
    (req.headers.Authorization as string);

  console.log({ authHeader });

  if (!authHeader?.startsWith("Bearer "))
    return next(new HttpError("Nie masz dostępu do tych zasobów.", 401));

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    EnvironmentalVariablesUtil.getAccessTokenSecret(),
    (err, decoded: any) => {
      if (err) return next(new HttpError("Token jest niepoprawny", 403));
      req.user = decoded.UserInfo.userName;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

export default verifyJWT;
