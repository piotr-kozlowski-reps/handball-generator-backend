const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const backgroundImageSchema = new mongoose.Schema({
  backgroundImageName: { type: String, required: true, unique: true },
  backgroundImage: { type: String, required: true },
  backgroundImageThumbnail: { type: String, required: true },
});

backgroundImageSchema.plugin(uniqueValidator);
module.exports = mongoose.model("BackgroundImage", backgroundImageSchema);
