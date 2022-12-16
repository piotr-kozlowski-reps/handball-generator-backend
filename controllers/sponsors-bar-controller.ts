import HttpError from "../utils/http-error";
import SponsorsBar from "../models/SponsorsBar";

import { Request, Response, NextFunction } from "express";
import MongoDBUtils from "../utils/MongoDBUtils";
import { TDeleteFileResponse, TSponsorsBar } from "../utils/app.types";
import ImageFilesUtils from "../utils/ImageFilesUtils";
import { fetchAll_General, fetchOne_General } from "../utils/general-crud";

export const getAllSponsorsBars = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchAll_General(SponsorsBar, req, res, next);
};

export const getSponsorsBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchOne_General(SponsorsBar, req, res, next);
};

export const createSponsorsBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let filesArray: Express.Multer.File[] | undefined = req.files as
    | Express.Multer.File[]
    | undefined;
  const { barName } = req.body;

  // if no fields values - send error response
  if (!barName)
    return next(new HttpError("Nazwa belki sponsorów jest wymagana.", 400));
  if (!filesArray || filesArray.length < 1) {
    return next(new HttpError("Musisz przesłać plik belki sponsorów.", 400));
  }
  if (filesArray.length > 1) {
    return next(
      new HttpError(
        "Nie możesz przesłać więcej niż jeden plik belki sponsorów.",
        400
      )
    );
  }

  console.log(filesArray);

  //check team with this teamName exist already in Database
  let foundSponsorsBar: TSponsorsBar | null;
  try {
    foundSponsorsBar = await SponsorsBar.findOne({ barName: barName });
  } catch (err) {
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy belka sponsorów już istnieje, spróbuj ponownie.",
        500
      )
    );
  }

  if (foundSponsorsBar) {
    ImageFilesUtils.deleteFiles([filesArray[0].path]);
    return next(
      new HttpError("Belka sponsorów o takiej nazwie już istnieje.", 400)
    );
  }

  // create new Sponsors Bar
  const newSponsorBar = new SponsorsBar({
    barName,
    sponsorsBarImage: filesArray[0].path,
  });

  let result;
  try {
    result = await newSponsorBar.save();
    console.log(result);
  } catch (err) {
    return next(
      new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
    );
  }
  //final response
  res.status(201).json({ result });
};

export const updateSponsorsBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new Error("Not implemented.");
  res.status(200).json({ message: "updateSponsorsBar" });
};

export const deleteSponsorsBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID paska sponsorów.", 400));
  }

  if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let filesDeletedResponse: TDeleteFileResponse[];
  try {
    const sponsorBar = await SponsorsBar.findOne({ _id: req.params.id }).exec();
    if (!sponsorBar) {
      return next(
        new HttpError(`Nie ma paska sponsorów o ID: ${req.params.id}.`, 204)
      );
    }

    //deleting file
    try {
      filesDeletedResponse = ImageFilesUtils.deleteFiles([
        sponsorBar.sponsorsBarImage,
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
          `Błąd serwera, skasowanie pliku paska sponsorów nie powiodło się.`,
          500
        )
      );
    }

    ////response
    const result = await sponsorBar.deleteOne();
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

/////////////////////////////// OLD
// const getAllSponsorsBars = async (req, res, next) => {
//   let sponsorsBars;
//   try {
//     sponsorsBars = await SponsorsBar.find();
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }

//   console.log(sponsorsBars);

//   res.status(200).json(sponsorsBars);
// };

// const getSponsorsBar = async (req, res, next) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagane ID belki sponsorów.", 400));
//   }

//   if (!checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }

//   let sponsorsBar;
//   try {
//     sponsorsBar = await SponsorsBar.findOne({ _id: req.params.id });
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }

//   if (!sponsorsBar) {
//     return next(new HttpError("Nie ma belki sponsorów o takim ID.", 204));
//   }

//   res.status(200).json({ sponsorsBar });
// };
