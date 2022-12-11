// const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");
// const { deleteFiles } = require("../utils/deleteFIle");
import HttpError from "../utils/http-error";
import BackgroundImage from "../models/BackgroundImage";
import { Request, Response, NextFunction } from "express";
import MongoDBUtils from "../utils/MongoDBUtils";
import OverallUtils from "../utils/OverallUtils";
import ImageFilesUtils from "../utils/ImageFilesUtils";
import {
  IImageProcessingError,
  TBackgroundImage,
  TDeleteFileResponse,
  TProcessedImageFile,
  TUnprocessedImageResponse,
} from "../utils/app.types";
import { Model } from "mongoose";

// const { createThumbnails } = require("../utils/createThumbnail");

export const getAllBackgroundImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let backgrounds;
  try {
    backgrounds = await BackgroundImage.find();
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  res.status(200).json(backgrounds);
};

export const getBackgroundImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagane ID tła.", 400));
  }

  if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let backgroundImage;
  try {
    backgroundImage = await BackgroundImage.findOne({ _id: req.params.id });
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  if (!backgroundImage) {
    return next(new HttpError("Nie ma tła o takim ID.", 204));
  }

  res.status(200).json({ backgroundImage });
};

export const createBackgroundImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const finalProcessedImagesArray: TBackgroundImage[] = [];
  const finalUnprocessedImagesArray: TUnprocessedImageResponse[] = [];

  let filesArray: Express.Multer.File[] | undefined = req.files as
    | Express.Multer.File[]
    | undefined;

  if (!filesArray || filesArray?.length < 1) {
    return next(new HttpError("Musisz przesłać choć jeden plik tła.", 400));
  }

  //generate backgroundImageName from names of files
  const backgroundImageNamesArray: string[] = filesArray.map((file) => {
    return file.originalname.split(".")[0];
  });
  if (OverallUtils.checkIfArrayHasDuplicates(backgroundImageNamesArray)) {
    deleteFiles(filesArray);
    return next(
      new HttpError(
        "W przesłanych plikach znajdowały się pliki o tej samej nazwie.",
        400
      )
    );
  }

  //check if any of backgroundImageNames exist already in Database
  let foundBackgrounds: TBackgroundImage[] = [];
  try {
    for (let i = 0; i < backgroundImageNamesArray.length; i++) {
      const foundBackgroundInDB = await BackgroundImage.findOne({
        backgroundImageName: backgroundImageNamesArray[i],
      });
      if (foundBackgroundInDB) foundBackgrounds.push(foundBackgroundInDB);
    }
  } catch (err) {
    deleteFiles(filesArray);
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy pliki tła już istnieją, spróbuj ponownie.",
        500
      )
    );
  }

  if (foundBackgrounds.length > 0) {
    const filesToBeProcessedFurtherArray: Express.Multer.File[] = [];
    const fileDuplicatesArray: Express.Multer.File[] = [];
    const duplicateImagesNames = foundBackgrounds.map(
      (background) => background.backgroundImageName
    );

    filesArray.forEach((file) => {
      const imageName = file.originalname.split(".")[0];

      duplicateImagesNames.includes(imageName)
        ? fileDuplicatesArray.push(file)
        : filesToBeProcessedFurtherArray.push(file);
    });

    finalUnprocessedImagesArray.push(
      ...fileDuplicatesArray.map((image) => ({
        fileName: image.originalname,
        error: IImageProcessingError.NAME_ALREADY_IN_DATABASE,
      }))
    );

    filesArray = filesArray.filter(
      (image) => !fileDuplicatesArray.includes(image)
    );

    //delete duplicates and send response if no files left
    deleteFiles(fileDuplicatesArray);
    if (filesArray.length < 1) {
      return next(
        new HttpError(
          "Przesłane pliki tła o takiej/takich nazwach już istnieją w bazie danych.",
          500
        )
      );
    }
  }

  //create all thumbnails
  const { processedImages, unprocessedImages } =
    await ImageFilesUtils.createThumbnails(filesArray);

  //delete images if their thumbnails were unprocessed
  if (unprocessedImages.length > 0) {
    deleteFiles(unprocessedImages);
    finalUnprocessedImagesArray.push(
      ...unprocessedImages.map((image) => ({
        fileName: image.originalname,
        error: IImageProcessingError.THUMBNAIL_CREATION_FAILURE,
      }))
    );
  }

  //create BackgroundImagesObjects
  const backgroundImagesObjects = processedImages.map((image) => {
    return new BackgroundImage<TBackgroundImage>({
      backgroundImageName: image.originalname.split(".")[0],
      backgroundImage: image.path,
      backgroundImageThumbnail: image.thumbnailPath,
    });
  });
  let result;
  try {
    result = await BackgroundImage.insertMany(backgroundImagesObjects);
    finalProcessedImagesArray.push(...result);
  } catch (error) {
    console.error(error);
    deleteFiles(processedImages);
    await BackgroundImage.deleteMany(backgroundImagesObjects);
    finalUnprocessedImagesArray.push(
      ...processedImages.map((image) => ({
        fileName: image.originalname,
        error: IImageProcessingError.DATABASE_CREATION_DOCUMENT_ERROR,
      }))
    );
  }

  res.status(finalProcessedImagesArray.length > 0 ? 201 : 500).json({
    processedImages: finalProcessedImagesArray,
    unprocessedImages: finalUnprocessedImagesArray,
  });
};

export const updateBackgroundImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: "updateBackgroundImage - not Implemented" });
};

export const deleteBackgroundImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID pliku tła.", 400));
  }

  if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let filesDeletedResponse: TDeleteFileResponse[];
  try {
    const backgroundImage = await BackgroundImage.findOne({
      _id: req.params.id,
    }).exec();

    if (!backgroundImage) {
      return next(new HttpError(`Nie ma tła o ID: ${req.params.id}.`, 204));
    }

    //deleting file
    try {
      filesDeletedResponse = ImageFilesUtils.deleteFilesWithPathsArrayArgument([
        backgroundImage.backgroundImage,
        backgroundImage.backgroundImageThumbnail,
      ]);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie plików graficznych nie powiodło się.`,
          500
        )
      );
    }

    console.log({ filesDeletedResponse });
    //if couldn't delete file for any reason - inform that in response
    if (filesDeletedResponse.includes("FILE_UNDELETED")) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku tła nie powiodło się.`,
          500
        )
      );
    }

    //response
    const result = await backgroundImage.deleteOne();
    res.json(result);
  } catch (error) {
    return next(
      new HttpError(
        `Błąd serwera, połączenie z bazą danych nie powiodło się.`,
        500
      )
    );
  }
};

////private
function deleteFiles(arrayOfFiles: Express.Multer.File[]) {
  const result =
    ImageFilesUtils.deleteFilesWithFilesArrayArgument(arrayOfFiles);
  return result;
}
