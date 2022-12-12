import * as fs from "fs";
import { logEvents } from "../middleware/logEvents";
import { TDeleteFileResponse, TProcessedImageFile } from "./app.types";
import { ERROR_LOGGER } from "../config/loggerFilesNames";
import path from "path";
import sharp from "sharp";

export default class ImageFilesUtils {
  //images utils
  static deleteFiles(items: Express.Multer.File[] | string[]) {
    const result: TDeleteFileResponse[] = [];
    items.forEach((file) => {
      const deleteResult = this.deleteFile(file.path);
      result.push(deleteResult);
    });

    return result;
  }

  static deleteFilesWithPathsArrayArgument(pathsArray: string[]) {
    const result: TDeleteFileResponse[] = [];
    pathsArray.forEach((path) => {
      const deleteResult = this.deleteFile(path);
      result.push(deleteResult);
    });

    return result;
  }

  static async createThumbnails(imagesArray: Express.Multer.File[]) {
    const processedImages: TProcessedImageFile[] = [];
    const unprocessedImages: Express.Multer.File[] = [];

    try {
      for (let i = 0; i < imagesArray.length; i++) {
        const imageFile = imagesArray[i];
        const result = await this.createThumbnail(imageFile);
        if (!result) unprocessedImages.push(imageFile);
        else {
          const imageWithThumbnail: TProcessedImageFile = Object.assign(
            imageFile,
            { thumbnailPath: result.thumbnailPath }
          );
          processedImages.push(imageWithThumbnail);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return { processedImages, unprocessedImages };
  }

  //private
  private static async createThumbnail(imageFile: Express.Multer.File) {
    const filePath = imageFile.path;
    const fileNameFull = path.basename(filePath);
    const directoriesPath = filePath.replace(fileNameFull, "");
    const extensionName = path.extname(fileNameFull);
    const fileNameWithoutExtension = fileNameFull
      .replace(extensionName, "")
      .toLowerCase();

    //thumbnail path and name
    const thumbnailPath = `${directoriesPath}${fileNameWithoutExtension}__thumbnail.jpg`;

    //create thumbnail
    let newThumbnail;
    try {
      newThumbnail = await sharp(filePath)
        .resize({
          width: 200,
          height: 200,
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0.5 },
        })
        .toFormat("jpg", { quality: 30 })
        .toFile(thumbnailPath);
    } catch (error) {
      console.error(error);
      return;
    }

    return { newThumbnail, thumbnailPath };
  }

  private static deleteFile(filePath: string): TDeleteFileResponse {
    console.log(`deleting file: ${filePath}`);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return "FILE_DELETED";
      } catch (err) {
        const error = err as any;
        logEvents(`${error.name}: ${error.message}`, ERROR_LOGGER);
        return "FILE_UNDELETED";
      }
    }

    return " FILE_NOT_FOUND";
  }
}
