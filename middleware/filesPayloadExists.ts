import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";

/** filesPayloadExists checks if there is file or files property in req */
const filesPayloadExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log({ req });

  console.log("req.file: ", req.file);
  console.log("req.files: ", req.files);

  if (!req.file && !req.files) {
    return next(new HttpError("Brak pliku/ów graficznych.", 400));
  }
  if (!req.file && req.files?.length === 0) {
    return next(new HttpError("Brak pliku/ów graficznych.", 400));
  }

  next();
};

export default filesPayloadExists;
