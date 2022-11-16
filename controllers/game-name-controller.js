const deleteFile = require("../helpers/deleteFile");
const HttpError = require("../helpers/http-error");
const GameName = require("../models/GameName");
const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");
const { checkMongoIdLength } = require("../utils/checkMongoIDLength");

const getAllGameNames = async (req, res, next) => {
  let gameNames;
  try {
    gameNames = await GameName.find();
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  res.status(200).json(gameNames);
};

const getGameName = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID rodzaju rozgrywek.", 400));
  }

  if (!checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let gameName;
  try {
    gameName = await GameName.findOne({ _id: req.params.id });
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  if (!gameName) {
    return next(new HttpError("Nie ma rozgrywek o takim ID.", 204));
  }

  res.status(200).json({ gameName });
};

const createGameName = async (req, res, next) => {
  const { gameName } = req.body;
  if (!gameName)
    return res.status(400).json({ message: "Nazwa rozgrywek jest wymagana." });

  let foundGameName;
  try {
    foundGameName = await GameName.findOne({
      gameName: gameName,
    });
  } catch (err) {
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy nazwa rozgrywek już istnieje, spróbuj ponownie.",
        500
      )
    );
  }
  if (foundGameName) {
    deleteFile(req.file.path);
    return next(new HttpError("Nazwa rozgrywek już istnieje.", 400));
  }
  const newGameName = new GameName({
    gameName,
    gameImage: req.file.path,
  });

  console.log(newGameName);

  let result;
  try {
    result = await newGameName.save();
    console.log({ result });
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
    );
  }
  //final response
  res.status(201).json({ result });
};

const updateGameName = async (req, res, next) => {
  res.status(200).json({ message: "updateGameName" });
};

const deleteGameName = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID rodzaju rozgrywek.", 400));
  }

  if (!checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let fileDeletedResponse;
  try {
    const gameName = await GameName.findOne({
      _id: req.params.id,
    }).exec();
    if (!gameName) {
      return next(
        new HttpError(`Nie ma rozgrywek o ID: ${req.params.id}.`, 204)
      );
    }
    try {
      fileDeletedResponse = deleteFile(gameName.gameImage);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
          500
        )
      );
    }

    if (fileDeletedResponse === DELETE_FILE_RESPONSE.fileUnDeleted) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego rozgrywek nie powiodło się.`,
          500
        )
      );
    }

    const result = await gameName.deleteOne();
    res.json(result);
  } catch (error) {
    return next(
      new HttpError(`Błąd serwera, skasowanie rozgrywek nie powiodło się.`, 500)
    );
  }
};

module.exports = {
  getAllGameNames,
  getGameName,
  createGameName,
  updateGameName,
  deleteGameName,
};
