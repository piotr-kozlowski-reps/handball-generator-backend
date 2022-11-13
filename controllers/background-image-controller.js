const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");
const BackgroundImage = require("../models/BackgroundImage");
const { createThumbnail } = require("../utils/createThumbnail");

const getAllBackgroundImages = async (req, res, next) => {
  let backgrounds;
  try {
    backgrounds = await BackgroundImage.find();
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  res.status(200).json(backgrounds);
};

const getBackgroundImage = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagane ID tła.", 400));
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

// const getGameName = async (req, res, next) => {

// };

const createBackgroundImage = async (req, res, next) => {
  const { backgroundImageName } = req.body;
  if (!backgroundImageName)
    return res.status(400).json({ message: "Nazwa tła jest wymagana." });

  let foundBackground;
  try {
    foundBackground = await BackgroundImage.findOne({
      backgroundImageName: backgroundImageName,
    });
  } catch (err) {
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy plik tła już istnieje, spróbuj ponownie.",
        500
      )
    );
  }
  if (foundBackground) {
    deleteFile(req.file.path);
    return next(new HttpError("Plik tła o takiej nazwie już istnieje.", 400));
  }
  const newBackgroundImage = new BackgroundImage({
    backgroundImageName,
    backgroundImage: req.file.path,
    backgroundImageThumbnail: createThumbnail(req.file.path),
  });

  let result;
  try {
    result = await newBackgroundImage.save();
    console.log(result);
  } catch (err) {
    return next(
      new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
    );
  }
  //final response
  res.status(201).json({ result });
};

const updateBackgroundImage = async (req, res, next) => {
  res.status(200).json({ message: "updateBackgroundImage" });
};

const deleteBackgroundImage = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID pliku tła.", 400));
  }

  try {
    const backgroundImage = await BackgroundImage.findOne({
      _id: req.params.id,
    }).exec();
    if (!backgroundImage) {
      return next(new HttpError(`Nie ma tła o ID: ${req.params.id}.`, 204));
    }
    try {
      deleteFile(backgroundImage.backgroundImage);
      deleteFile(backgroundImage.backgroundImageThumbnail);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
          500
        )
      );
    }
    ////TODO:  jeżeli skasowanie plików się powiodło - skasuj wpis do bazy
    const result = await backgroundImage.deleteOne();
    res.json(result);
  } catch (error) {
    return next(
      new HttpError(`Błąd serwera, skasowanie tła nie powiodło się.`, 500)
    );
  }
};

module.exports = {
  getAllBackgroundImages,
  getBackgroundImage,
  createBackgroundImage,
  updateBackgroundImage,
  deleteBackgroundImage,
};
