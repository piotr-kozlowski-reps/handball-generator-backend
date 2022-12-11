import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";

/** filesPayloadExists checks if there is file or files property in req */
const filesPayloadExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file && !req.files) {
    return next(new HttpError("Brak pliku/ów graficznych.", 400));
  }
  next();
};

export default filesPayloadExists;
