const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  place: { type: String, required: true },
  teamCrest: { type: String, required: true },
});

teamSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Team", teamSchema);
