const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const gameNameSchema = new mongoose.Schema({
  gameName: { type: String, required: true, unique: true },
  gameImage: { type: String, required: true },
});

gameNameSchema.plugin(uniqueValidator);
module.exports = mongoose.model("GameName", gameNameSchema);
