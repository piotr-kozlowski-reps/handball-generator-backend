import path from "path";
// const deleteFile = require("../utils/deleteFIle");
import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";
import ImageFilesUtils from "../utils/ImageFilesUtils";

/** fileExtensionLimiter checks if all files from form have desired extensions |
 * example of allowedExtensionsArray: [".png", ".jpg", ".jpeg"]
 */
const fileExtensionLimiter = (allowedExtensionsArray: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const files = req.files as Express.Multer.File[];

    // console.log({ file });
    // console.log({ files });

    let isAllowed = true;
    if (file) {
      const fileExtension = path.extname(file.originalname);
      isAllowed = allowedExtensionsArray.includes(fileExtension);
    }
    if (files) {
      files.forEach((file) => {
        const fileExtension = path.extname(file.originalname);
        isAllowed = isAllowed && allowedExtensionsArray.includes(fileExtension);
      });
    }
    if (files.length < 1) isAllowed = false;

    if (!isAllowed) {
      ImageFilesUtils.deleteFilesWithFilesArrayArgument(file ? [file] : files);
      return next(
        new HttpError(
          `Obrazek musi być plikiem o rozszerzeniu: ${allowedExtensionsArray.toString()}`,
          400
        )
      );
    }

    next();
  };
};

export default fileExtensionLimiter;
