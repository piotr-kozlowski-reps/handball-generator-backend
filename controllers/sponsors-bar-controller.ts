import HttpError from "../utils/http-error";
import SponsorsBar from "../models/SponsorsBar";

import { Request, Response, NextFunction } from "express";
import MongoDBUtils from "../utils/MongoDBUtils";
import { TDeleteFileResponse } from "../utils/app.types";
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

// const createSponsorsBar = async (req, res, next) => {
//   const { barName } = req.body;
//   if (!barName)
//     return res
//       .status(400)
//       .json({ message: "Nazwa belki sponsorów jest wymagana." });

//   let foundSponsorsBar;
//   try {
//     foundSponsorsBar = await SponsorsBar.findOne({ barName: barName });
//   } catch (err) {
//     return next(
//       new HttpError(
//         "Nie udało się zweryfikować czy belka sponsorów już istnieje, spróbuj ponownie.",
//         500
//       )
//     );
//   }
//   console.log({ foundSponsorsBar });
//   if (foundSponsorsBar) {
//     deleteFile(req.file.path);
//     return next(
//       new HttpError("Belka sponsorów o takiej nazwie już istnieje.", 400)
//     );
//   }
//   const newSponsorBar = new SponsorsBar({
//     barName,
//     sponsorsBarImage: req.file.path,
//   });
//   let result;
//   try {
//     result = await newSponsorBar.save();
//     console.log(result);
//   } catch (err) {
//     return next(
//       new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
//     );
//   }
//   //final response
//   res.status(201).json({ result });
// };

// const updateSponsorsBar = async (req, res, next) => {
//   res.status(200).json({ message: "updateSponsorsBar" });
// };

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
