import express from "express";
import { uploadImage, uploadMiddleware } from "../controllers/upload.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, uploadMiddleware, uploadImage);

export default router;
