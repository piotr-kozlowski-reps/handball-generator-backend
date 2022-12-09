import express from "express";
import { authHandler } from "../controllers/auth-controller";
const router = express.Router();

router.post("/", authHandler);

export default router;
