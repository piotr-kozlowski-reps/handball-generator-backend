const mongoose = require("mongoose");
const { logEvents } = require("../middleware/logEvents");
const { ERROR_LOGGER } = require("./loggerFilesNames");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qujvakl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (err) {
    logEvents(err.message, ERROR_LOGGER);
    console.error(err);
  }
};

module.exports = connectDB;
