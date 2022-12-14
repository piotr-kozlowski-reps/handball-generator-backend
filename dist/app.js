"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const createMulterStorage_1 = require("./config/createMulterStorage");
const http_error_1 = __importDefault(require("./utils/http-error"));
const logEvents_1 = require("./middleware/logEvents");
const bdConn_1 = __importDefault(require("./config/bdConn"));
// const credentials = require("./middleware/credentials");
// const allowedOrigins = require("./config/allowedOrigins");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const verifyJWT_1 = __importDefault(require("./middleware/verifyJWT"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const refresh_routes_1 = __importDefault(require("./routes/refresh-routes"));
const logout_routes_1 = __importDefault(require("./routes/logout-routes"));
const team_routes_1 = __importDefault(require("./routes/team-routes"));
const background_image_routes_1 = __importDefault(require("./routes/background-image-routes"));
const sponsors_bar_routes_1 = __importDefault(require("./routes/sponsors-bar-routes"));
const game_name_routes_1 = __importDefault(require("./routes/game-name-routes"));
// /** connect to MongoDB */
(0, bdConn_1.default)();
// /** custom middleware logger */
app.use(logEvents_1.logger);
/** show request middleware - just consol.log it when needed*/
// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });
// /** static files server */
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
//multer
const multer_1 = __importDefault(require("multer"));
const storage = (0, createMulterStorage_1.createMulterStorage)(multer_1.default);
const upload = (0, multer_1.default)({ storage: storage });
/**  custom handler ->  options credentials add when request from allowOrigins array - needs to be before CORS() */
// app.use(credentials);
//TODO: nie działało mi w chromie podczas developmentu - nie wiem dlaczego
/**  Cross Origin Resource Sharing */
let corsConfig = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.options("*", (0, cors_1.default)(corsConfig));
/** express middleware to handle urlencoded form data */
app.use(express_1.default.urlencoded({ extended: true }));
/** express middleware for json data */
app.use(express_1.default.json());
/** middleware for cookies */
app.use((0, cookie_parser_1.default)());
/** free accessed routes */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/refresh", refresh_routes_1.default);
app.use("/api/logout", logout_routes_1.default);
/** protected routes */
app.use(verifyJWT_1.default);
app.use("/api/team", upload.array("teamCrestImage"), team_routes_1.default);
app.use("/api/sponsors-bar", upload.array("sponsorsBarImage"), sponsors_bar_routes_1.default);
app.use("/api/background-image", upload.array("backgroundImages"), background_image_routes_1.default);
app.use("/api/game-name", upload.array("gameImage"), game_name_routes_1.default);
/**  error handling */
app.use((req, res, next) => {
    return next(new http_error_1.default("Could not find this route.", 404));
});
app.use(errorHandler_1.default);
// /** listener */
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port: ${process.env.PORT}`);
    });
});
