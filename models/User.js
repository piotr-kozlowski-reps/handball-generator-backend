const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
  },
  refreshToken: String,
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
