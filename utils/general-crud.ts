import { Request, Response, NextFunction } from "express";
import { TDeleteFileResponse } from "./app.types";
import HttpError from "./http-error";
import ImageFilesUtils from "./ImageFilesUtils";
import MongoDBUtils from "./MongoDBUtils";

export const fetchAll_General = async (
  model: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //main function - start
  const getAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let resultArray;
    try {
      resultArray = await model.find();
      console.log(resultArray);
    } catch (err) {
      return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
    }

    res.status(200).json(resultArray);
  };
  //main function - end

  getAllItems(req, res, next);
};

export const fetchOne_General = async (
  model: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //main function - start
  const getItem = async (req: Request, res: Response, next: NextFunction) => {
    if (!req?.params?.id) {
      return next(new HttpError("ID jest wymagane.", 400));
    }

    if (!MongoDBUtils.checkMongoIdLength(req.params.id)) {
      return next(new HttpError("Podane ID ma złą formę.", 400));
    }

    let result;
    try {
      result = await model.findOne({ _id: req.params.id });
    } catch (err) {
      return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
    }

    if (!result) {
      return next(
        new HttpError("Nie ma żadnych informacji dla przekazanaego ID.", 204)
      );
    }

    res.status(200).json(result);
  };
  //main function - end

  getItem(req, res, next);
};
