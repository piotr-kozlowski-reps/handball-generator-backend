import mongoose, { ConnectOptions } from "mongoose";
import { logEvents } from "../middleware/logEvents";
import { ERROR_LOGGER } from "./loggerFilesNames";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qujvakl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions
    );
  } catch (err) {
    const error: any = err;
    logEvents(
      error.message || "Problem with connection with mongoDB.",
      ERROR_LOGGER
    );

    console.error(err);
  }
};

export default connectDB;
