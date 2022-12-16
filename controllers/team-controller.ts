import HttpError from "../utils/http-error";
import Team from "../models/Team";
import { Request, Response, NextFunction } from "express";
import MongoDBUtils from "../utils/MongoDBUtils";
import {
  TBackgroundImage,
  TDeleteFileResponse,
  TTeam,
  TUnprocessedImageResponse,
} from "../utils/app.types";
import ImageFilesUtils from "../utils/ImageFilesUtils";
import { fetchAll_General, fetchOne_General } from "../utils/general-crud";

export const getAllTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchAll_General(Team, req, res, next);
};

export const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchOne_General(Team, req, res, next);
};

export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let filesArray: Express.Multer.File[] | undefined = req.files as
    | Express.Multer.File[]
    | undefined;
  const { teamName, place } = req.body;

  // if no fields values - send error response
  if (!teamName)
    return next(new HttpError("Nazwa drużyny jest wymagana.", 400));

  if (!place)
    return next(new HttpError("Lokalizacja drużyny jest wymagana.", 400));

  if (!filesArray || filesArray.length < 1) {
    return next(new HttpError("Musisz przesłać plik tła.", 400));
  }
  if (filesArray.length > 1) {
    return next(
      new HttpError("Nie możesz przesłać więcej niż jeden plik tła.", 400)
    );
  }

  console.log(filesArray);

  //check team with this teamName exist already in Database
  let foundTeam: TTeam | null;
  try {
    foundTeam = await Team.findOne({ teamName: teamName });
  } catch (err) {
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy drużyna już istnieje, spróbuj ponownie.",
        500
      )
    );
  }

  if (foundTeam) {
    ImageFilesUtils.deleteFiles([filesArray[0].path]);
    return next(new HttpError("Drużyna już istnieje.", 400));
  }

  // create new Team
  const newTeam = new Team({
    teamName,
    place,
    teamCrestImage: filesArray[0].path,
  });

  let result;
  try {
    result = await newTeam.save();
    console.log(result);
  } catch (err) {
    return next(
      new HttpError("Nie udało zapisać danych w bazie, spróbuj ponownie.", 500)
    );
  }

  //final response
  res.status(201).json({ result });
};

export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new Error("Not implemented.");
  res.status(200).json({ message: "updateTeam" });
};

export const deleteTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID drużyny.", 400));
  }

  if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let filesDeletedResponse: TDeleteFileResponse[];
  try {
    const team = await Team.findOne({ _id: req.params.id }).exec();
    if (!team) {
      return next(new HttpError(`Nie ma drużyny o ID: ${req.params.id}.`, 204));
    }

    //deleting file
    try {
      filesDeletedResponse = ImageFilesUtils.deleteFiles([team.teamCrestImage]);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
          500
        )
      );
    }

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
    const result = await team.deleteOne();
    res.json(result);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        `Błąd serwera, połączenie z bazą danych nie powiodło się.`,
        500
      )
    );
  }
};

/////////////////////////////// OLD
// export const getAllTeams = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let teams;
//   try {
//     teams = await Team.find();
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }

//   res.status(200).json(teams);
// };

// export const getTeam = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req?.params?.id) {
//     return next(new HttpError("Wymagane ID drużyny.", 400));
//   }

//   if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
//     return next(new HttpError("Podane ID ma złą formę.", 400));
//   }

//   let team;
//   try {
//     team = await Team.findOne({ _id: req.params.id });
//   } catch (err) {
//     return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
//   }

//   if (!team) {
//     return next(new HttpError("Nie ma drużyny o takim ID.", 204));
//   }

//   res.status(200).json({ team });
// };
