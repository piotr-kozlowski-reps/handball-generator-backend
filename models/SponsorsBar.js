const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sponsorsBarSchema = new mongoose.Schema({
  barName: { type: String, required: true, unique: true },
  sponsorsBarImage: { type: String, required: true },
});

sponsorsBarSchema.plugin(uniqueValidator);
module.exports = mongoose.model("SponsorsBar", sponsorsBarSchema);
