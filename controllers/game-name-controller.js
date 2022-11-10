const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");
const GameName = require("../models/GameName");

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
  res.status(200).json({ message: "getGameName" });
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
      deleteFile(gameName.gameImage);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
          500
        )
      );
    }
    ////TODO:  jeżeli skasowanie plików się powiodło - skasuj wpis do bazy
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
