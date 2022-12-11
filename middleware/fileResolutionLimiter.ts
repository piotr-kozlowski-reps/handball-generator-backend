import sharp from "sharp";
// const deleteFile = require("../utils/deleteFIle");
import HttpError from "../utils/http-error";
import { Request, Response, NextFunction } from "express";
import ImageFilesUtils from "../utils/ImageFilesUtils";
import EnvironmentalVariablesUtil from "../utils/EnvironmentalVariablesUtils";

const fileResolutionLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file as Express.Multer.File;
  const files = req.files as Express.Multer.File[];

  let isAllowed = true;
  const filesArrayToBePossiblyDeleted: Express.Multer.File[] = [];
  if (file) {
    filesArrayToBePossiblyDeleted.push(file);
    (await checkIfFileSuitsSizeLimits(file))
      ? (isAllowed = isAllowed)
      : (isAllowed = false);
  }

  if (files) {
    filesArrayToBePossiblyDeleted.push(...files);

    for (let i = 0; i < files.length; i++) {
      const isFileInTheLimits = await checkIfFileSuitsSizeLimits(files[i]);
      isAllowed = isAllowed && isFileInTheLimits;
    }
  }

  if (!isAllowed) {
    ImageFilesUtils.deleteFilesWithFilesArrayArgument(
      filesArrayToBePossiblyDeleted
    );

    return next(
      new HttpError(
        `Któryś z plików ma zbyt duże wymiary.\nDopuszczalna szerokość pliku to: ${EnvironmentalVariablesUtil.getImageWidthLimiter()} px.\nDopuszczalna wysokość pliku to: ${EnvironmentalVariablesUtil.getImageHeightLimiter()} px.`,
        400
      )
    );
  }

  async function checkIfFileSuitsSizeLimits(file: Express.Multer.File) {
    const widthLimit = EnvironmentalVariablesUtil.getImageWidthLimiter();
    const heightLimit = EnvironmentalVariablesUtil.getImageHeightLimiter();

    let image: sharp.Sharp;
    let metadata: sharp.Metadata;
    try {
      image = await sharp(file.path);
      metadata = await image.metadata();

      if (!metadata) return false;
      if (
        !metadata.width ||
        metadata.width > widthLimit ||
        !metadata.height ||
        metadata.height > heightLimit
      )
        return false;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function deleteFilesAndReturnError(filesPathsArray: Express.Multer.File[]) {
    ImageFilesUtils.deleteFilesWithFilesArrayArgument(filesPathsArray);

    return next(
      new HttpError(
        `Herb ma zbyt duże wymiary.\nDopuszczalna szerokość pliku to: ${EnvironmentalVariablesUtil.getImageWidthLimiter()} px.\nDopuszczalna wysokość pliku to: ${EnvironmentalVariablesUtil.getImageHeightLimiter()} px.`,
        400
      )
    );
  }

  next();
};

export default fileResolutionLimiter;
