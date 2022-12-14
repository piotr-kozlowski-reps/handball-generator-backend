import express, { Express } from "express";
const app: Express = express();

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { createMulterStorage } from "./config/createMulterStorage";

import HttpError from "./utils/http-error";
import { logger } from "./middleware/logEvents";
import connectDB from "./config/bdConn";
// const credentials = require("./middleware/credentials");
// const allowedOrigins = require("./config/allowedOrigins");
import errorHandler from "./middleware/errorHandler";
import verifyJWT from "./middleware/verifyJWT";

import authRoutes from "./routes/auth-routes";
import refreshRoutes from "./routes/refresh-routes";
import logoutRoutes from "./routes/logout-routes";
import teamRoutes from "./routes/team-routes";
import backgroundImages from "./routes/background-image-routes";
import sponsorsBars from "./routes/sponsors-bar-routes";
import gameName from "./routes/game-name-routes";

// /** connect to MongoDB */
connectDB();

// /** custom middleware logger */
app.use(logger);

/** show request middleware - just consol.log it when needed*/
// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });

// /** static files server */
app.use("/images", express.static(path.join(__dirname, "images")));

//multer
import multer from "multer";
const storage = createMulterStorage(multer);
const upload = multer({ storage: storage });

/**  custom handler ->  options credentials add when request from allowOrigins array - needs to be before CORS() */
// app.use(credentials);
//TODO: nie działało mi w chromie podczas developmentu - nie wiem dlaczego

/**  Cross Origin Resource Sharing */
let corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

/** express middleware to handle urlencoded form data */
app.use(express.urlencoded({ extended: true }));

/** express middleware for json data */
app.use(express.json());

/** middleware for cookies */
app.use(cookieParser());

/** free accessed routes */
app.use("/api/auth", authRoutes);
app.use("/api/refresh", refreshRoutes);
app.use("/api/logout", logoutRoutes);

/** protected routes */
app.use(verifyJWT);
app.use("/api/team", upload.array("teamCrestImage"), teamRoutes);
app.use("/api/sponsors-bar", upload.array("sponsorsBarImage"), sponsorsBars);
app.use(
  "/api/background-image",
  upload.array("backgroundImages"),
  backgroundImages
);
app.use("/api/game-name", upload.array("gameImage"), gameName);

/**  error handling */
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use(errorHandler);

// /** listener */
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
});
