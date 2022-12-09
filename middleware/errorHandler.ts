import { logEvents } from "./logEvents";
import { ERROR_LOGGER } from "../config/loggerFilesNames";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, ERROR_LOGGER);
  console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(err.code || 500).send(err.message || "An unknown error occurred.");
};

export default errorHandler;
