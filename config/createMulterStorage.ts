import path from "path";
import { format } from "date-fns";
import { DiskStorageOptions, Multer } from "multer";
import { Request, Response, NextFunction } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const createMulterStorage = (multer: any) => {
  return multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      // console.log("originalUrl: ", req.originalUrl);
      switch (req.originalUrl) {
        case "/api/team":
          cb(null, path.join("images", "team-crests"));
          return;
        case "/api/sponsors-bar":
          cb(null, path.join("images", "sponsors-bars"));
          return;
        case "/api/background-image":
          cb(null, path.join("images", "background-images"));
          return;
        case "/api/game-name":
          cb(null, path.join("images", "game-names"));
          return;
      }
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      cb(null, createFileName(file));
    },
  });
};

//utils
export function createFileName(file: Express.Multer.File): string {
  const date = format(Date.now(), "yyyyMMdd-HHmmss");

  return `${file.originalname.split(".")[0]}___${date}${path.extname(
    file.originalname
  )}`;
}
