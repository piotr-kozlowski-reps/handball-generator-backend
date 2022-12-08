const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");
const { deleteFiles } = require("../utils/deleteFIle");
const HttpError = require("../utils/http-error");
const BackgroundImage = require("../models/BackgroundImage");
const { checkMongoIdLength } = require("../utils/checkMongoIDLength");
const { createThumbnails } = require("../utils/createThumbnail");

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

  if (!checkMongoIdLength(req.params.id)) {
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

// const getGameName = async (req, res, next) => {

// };

const createBackgroundImage = async (req, res, next) => {
  // console.log(req.files);

  //   files: [
  //   {
  //     fieldname: 'backgroundImages',
  //     originalname: 'sklad_uklad_lista_wyjazd.jpg',
  //     encoding: '7bit',
  //     mimetype: 'image/jpeg',
  //     destination: 'images\\background-images',
  //     filename: 'sklad_uklad_lista_wyjazd___20221205-200933.jpg',
  //     path: 'images\\background-images\\sklad_uklad_lista_wyjazd___20221205-200933.jpg',
  //     size: 66654
  //   },
  //   {
  //     fieldname: 'backgroundImages',
  //     originalname: 'sklad_uklad_lista_wyjazd_thumbnail.jpg',
  //     encoding: '7bit',
  //     mimetype: 'image/jpeg',
  //     destination: 'images\\background-images',
  //     filename: 'sklad_uklad_lista_wyjazd_thumbnail___20221205-200933.jpg',
  //     path: 'images\\background-images\\sklad_uklad_lista_wyjazd_thumbnail___20221205-200933.jpg',
  //     size: 34060
  //   },
  //   {
  //     fieldname: 'backgroundImages',
  //     originalname: 'sklad_uklad_wyjazd.jpg',
  //     encoding: '7bit',
  //     mimetype: 'image/jpeg',
  //     destination: 'images\\background-images',
  //     filename: 'sklad_uklad_wyjazd___20221205-200933.jpg',
  //     path: 'images\\background-images\\sklad_uklad_wyjazd___20221205-200933.jpg',
  //     size: 403415
  //   }
  // ],

  /////////TODO
  // const { backgroundImageName } = req.body;
  // if (!backgroundImageName)
  //   return res.status(400).json({ message: "Nazwa tła jest wymagana." });

  // let foundBackground;
  // try {
  //   foundBackground = await BackgroundImage.findOne({
  //     backgroundImageName: backgroundImageName,
  //   });
  // } catch (err) {
  //   return next(
  //     new HttpError(
  //       "Nie udało się zweryfikować czy plik tła już istnieje, spróbuj ponownie.",
  //       500
  //     )
  //   );
  // }
  // if (foundBackground) {
  //   deleteFile(req.file.path);
  //   return next(new HttpError("Plik tła o takiej nazwie już istnieje.", 400));
  // }
  /////////TODO

  //thumbnail creation
  let resultOfThumbnailCreation;
  try {
    resultOfThumbnailCreation = await createThumbnails(req.files);
  } catch (error) {
    deleteFiles(req.file.path);
    return next(
      new HttpError("Nie udało się stworzyć minimalki pliku tła.", 500)
    );
  }

  console.log(resultOfThumbnailCreation);

  // if failed delete original file and thumbnail
  if (!resultOfThumbnailCreation || resultOfThumbnailCreation.length < 1) {
    deleteFiles(req.files.map((file) => file.path));
    deleteFiles(
      resultOfThumbnailCreation.map((thumbnail) => thumbnail.thumbnailPath)
    );
    return next(
      new HttpError("Nie udało się stworzyć minimalki pliku tła.", 500)
    );
  }

  ////////////////////////////

  // if any of returned object from thumbnails creation lacks newThumbnail/thumbnailPath properties
  //-> hence something went wrong
  //->  delete all original files
  //-> delete all well created thumbnails

  if (
    !resultOfThumbnailCreation.newThumbnail &&
    !resultOfThumbnailCreation.thumbnailName
  ) {
    // deleteFile(req.file.path); //TODO
    return next(
      new HttpError("Nie udało się stworzyć minimalki pliku tła.", 500)
    );
  }

  // console.log({ resultOfThumbnailCreation });

  const newBackgroundImage = new BackgroundImage({
    backgroundImageName,
    backgroundImage: req.file.path,
    backgroundImageThumbnail: resultOfThumbnailCreation.thumbnailName,
  });

  //deleting database document
  let result;
  try {
    result = await newBackgroundImage.save();
    // console.log(result);
  } catch (err) {
    console.log(err);
    deleteFile(req.file.path);
    deleteFile(resultOfThumbnailCreation.thumbnailName);
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

  if (!checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let fileDeletedResponse;
  let fileThumbnailDeletedResponse;
  try {
    const backgroundImage = await BackgroundImage.findOne({
      _id: req.params.id,
    }).exec();
    if (!backgroundImage) {
      return next(new HttpError(`Nie ma tła o ID: ${req.params.id}.`, 204));
    }

    //deleting file
    try {
      fileDeletedResponse = deleteFile(backgroundImage.backgroundImage);
      fileThumbnailDeletedResponse = deleteFile(
        backgroundImage.backgroundImageThumbnail
      );
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie plików graficznych nie powiodło się.`,
          500
        )
      );
    }

    if (
      fileDeletedResponse === DELETE_FILE_RESPONSE.fileUnDeleted ||
      fileThumbnailDeletedResponse === DELETE_FILE_RESPONSE.fileUnDeleted
    ) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego rozgrywek nie powiodło się.`,
          500
        )
      );
    }

    //response
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
