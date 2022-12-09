import express from "express";
import { refreshTokenHandler } from "../controllers/refresh-controller";
const router = express.Router();

router.get("/", refreshTokenHandler);

export default router;
