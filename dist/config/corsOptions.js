"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
/////CORS old - start - it was in app.ts
/**  custom handler ->  options credentials add when request from allowOrigins array - needs to be before CORS() */
// app.use(credentials);
//TODO: nie działało mi w chromie podczas developmentu - nie wiem dlaczego
////THAT WORKED
/**  Cross Origin Resource Sharing */
// let corsConfig = {
//   origin: true,
//   credentials: true,
// };
// app.use(cors(corsConfig));
// app.options("*", cors(corsConfig));
////THAT WORKED
/////CORS old - end
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
// const corsOptions: cors.CorsOptions = {
//   origin: (origin, callback) => {
//     if (origin && allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS."));
//     }
//   },
//   optionsSuccessStatus: 200,
// };
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
};
exports.default = (0, cors_1.default)(corsOptions);
