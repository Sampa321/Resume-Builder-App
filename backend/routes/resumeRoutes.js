
import express from "express";

import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All resume routes require authentication
router.use(protect);

// Create a new resume
router.post("/", createResume);

// Get all resumes of logged-in user
router.get("/", getResumes);

// Get one resume by ID
router.get("/:id", getResumeById);

// Update resume
router.put("/:id", updateResume);

// Delete resume
router.delete("/:id", deleteResume);

export default router;
