const deleteFile = require("../helpers/deleteFIle");
const HttpError = require("../helpers/http-error");
const SponsorsBar = require("../models/SponsorsBar");

const getAllSponsorsBars = async (req, res, next) => {
  res.status(200).json({ message: "getAllSponsorsBars" });
};

const getSponsorsBar = async (req, res, next) => {
  res.status(200).json({ message: "getSponsorsBar" });
};

const createSponsorsBar = async (req, res, next) => {
  const { barName } = req.body;
  if (!barName)
    return res
      .status(400)
      .json({ message: "Nazwa belki sponsorów jest wymagana." });

  let foundSponsorsBar;
  try {
    foundSponsorsBar = await SponsorsBar.findOne({ barName: barName });
  } catch (err) {
    return next(
      new HttpError(
        "Nie udało się zweryfikować czy belka sponsorów już istnieje, spróbuj ponownie.",
        500
      )
    );
  }
  console.log(foundSponsorsBar);
  if (foundSponsorsBar) {
    deleteFile(req.file.path);
    return next(
      new HttpError("Belka sponsorów o takiej nazwie już istnieje.", 400)
    );
  }
  const newSponsorBar = new SponsorsBar({
    barName,
    sponsorsBarImageUrl: req.file.path,
  });
  let result;
  try {
    result = await newSponsorBar.save();
    console.log(result);
  } catch (err) {
    return next(
      new HttpError("Nie udało zapisać danych, spróbuj ponownie.", 500)
    );
  }
  //final response
  res.status(201).json({ result });
};

const updateSponsorsBar = async (req, res, next) => {
  res.status(200).json({ message: "updateSponsorsBar" });
};

const deleteSponsorsBar = async (req, res, next) => {
  res.status(200).json({ message: "deleteSponsorsBar" });
};

module.exports = {
  getAllSponsorsBars,
  createSponsorsBar,
  getSponsorsBar,
  updateSponsorsBar,
  deleteSponsorsBar,
};
