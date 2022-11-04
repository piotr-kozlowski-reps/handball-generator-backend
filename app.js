const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createMulterStorage } = require("./config/createMulterStorage");

const HttpError = require("./helpers/http-error");
const { logger } = require("./middleware/logEvents");
const connectDB = require("./config/bdConn");
const credentials = require("./middleware/credentials");
const allowedOrigins = require("./config/allowedOrigins");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");

/** connect to MongoDB */
connectDB();

/** custom middleware logger */
app.use(logger);

//multer
const multer = require("multer");
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
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/refresh", require("./routes/refresh-routes"));
app.use("/api/logout", require("./routes/logout-routes"));

/** protected routes */
app.use(verifyJWT);
app.use(
  "/api/team",
  upload.single("teamCrest"),
  require("./routes/team-routes")
);

/**  error handling */
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use(errorHandler);

/** listener */
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
});
