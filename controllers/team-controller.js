const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");
const Team = require("../models/Team");

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
  res.status(200).json({ message: "getTeam" });
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

  console.log(foundTeam);

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

  try {
    const team = await Team.findOne({ _id: req.params.id }).exec();
    if (!team) {
      return next(new HttpError(`Nie ma drużyny o ID: ${req.params.id}.`, 204));
    }
    try {
      deleteFile(team.teamCrest);
    } catch (error) {
      return next(
        new HttpError(
          `Błąd serwera, skasowanie pliku graficznego nie powiodło się.`,
          500
        )
      );
    }
    ////TODO:  jeżeli skasowanie pliku się powiodło - skasuj wpis do bazy
    const result = await team.deleteOne(); //{ _id: req.body.id }
    res.json(result);
  } catch (error) {
    return next(
      new HttpError(`Błąd serwera, skasowanie drużyny nie powiodło się.`, 500)
    );
  }
};

module.exports = { getAllTeams, createTeam, getTeam, updateTeam, deleteTeam };
