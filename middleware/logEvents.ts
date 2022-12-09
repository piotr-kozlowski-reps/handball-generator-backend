import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { REQUEST_LOGGER } from "../config/loggerFilesNames";
import { Request, Response, NextFunction } from "express";

import * as fs from "fs";
import * as fsPromises from "fs/promises";
import path from "path";

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, REQUEST_LOGGER);
  console.log(`${req.method}\t${req.path}`);
  next();
};
