import express from "express";
import { logoutHandler } from "../controllers/logout-controller";
const router = express.Router();

router.get("/", logoutHandler);

export default router;
