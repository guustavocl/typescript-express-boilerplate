import express from "express";
import controller from "../controllers/ping.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.get("", rateLimiter(), controller.ping);

export default router;
