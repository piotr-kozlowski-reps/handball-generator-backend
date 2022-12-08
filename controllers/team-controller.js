const deleteFile = require("../utils/deleteFIle");
const HttpError = require("../utils/http-error");
const Team = require("../models/Team");
const { DELETE_FILE_RESPONSE } = require("../config/deleteFileResponse");
const { checkMongoIdLength } = require("../utils/checkMongoIDLength");

const getAllTeams = async (req, res, next) => {
  let teams;
  try {
    teams = await Team.find();
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  res.status(200).json(teams);
};

const getTeam = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagane ID drużyny.", 400));
  }

  if (!checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let team;
  try {
    team = await Team.findOne({ _id: req.params.id });
  } catch (err) {
    return next(new HttpError("Błąd serwera, spróbuj ponownie.", 500));
  }

  if (!team) {
    return next(new HttpError("Nie ma drużyny o takim ID.", 204));
  }

  res.status(200).json({ team });
};

const createTeam = async (req, res, next) => {
  const { teamName, place } = req.body;

  if (!teamName)
    return res.status(400).json({ message: "Nazwa drużyny jest wymagana." });

  if (!place)
    return res
      .status(400)
      .json({ message: "Lokalizacja drużyny jest wymagana." });

  let foundTeam;
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
    deleteFile(req.file.path);
    return next(new HttpError("Drużyna już istnieje.", 400));
  }

  const newTeam = new Team({
    teamName,
    place,
    teamCrestImage: req.file.path,
  });

  let result;
  try {
    result = await newTeam.save();
    console.log(result);
  } catch (err) {
    return next(
      new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
    );
  }

  //final response
  res.status(201).json({ result });
};

const updateTeam = async (req, res, next) => {
  res.status(200).json({ message: "updateTeam" });
};

const deleteTeam = async (req, res, next) => {
  if (!req?.params?.id) {
    return next(new HttpError("Wymagany ID drużyny.", 400));
  }

  if (!checkMongoIdLength(req.params.id)) {
    return next(new HttpError("Podane ID ma złą formę.", 400));
  }

  let fileDeletedResponse;
  try {
    const team = await Team.findOne({ _id: req.params.id }).exec();
    if (!team) {
      return next(new HttpError(`Nie ma drużyny o ID: ${req.params.id}.`, 204));
    }

    //delete file
    try {
      fileDeletedResponse = deleteFile(team.teamCrestImage);
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

    const result = await team.deleteOne(); //{ _id: req.body.id }
    res.json(result);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(`Błąd serwera, skasowanie drużyny nie powiodło się.`, 500)
    );
  }
};

module.exports = { getAllTeams, createTeam, getTeam, updateTeam, deleteTeam };
