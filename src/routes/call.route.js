import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCallHistory, createCallHistory } from "../controllers/call.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getCallHistory);
router.post("/history", protectRoute, createCallHistory);

export default router;
