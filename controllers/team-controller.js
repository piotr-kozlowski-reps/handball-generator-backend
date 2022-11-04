const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");
const Team = require("../models/Team");

const getAllTeams = async (req, res, next) => {
  res.status(200).json({ message: "getAllTeams" });
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
    teamCrest: req.file.path,
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
  res.status(200).json({ message: "deleteTeam" });
};

module.exports = { getAllTeams, createTeam, getTeam, updateTeam, deleteTeam };
