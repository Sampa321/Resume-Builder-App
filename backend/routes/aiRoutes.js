
import express from "express";
import { generateAIContent } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateAIContent);

export default router;
