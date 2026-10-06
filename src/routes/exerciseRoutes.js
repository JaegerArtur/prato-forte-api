import express from "express";
import { createExercise, deleteExercise, getExercise, getExercises, updateExercise } from "../controllers/exerciseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/?updatedSince", getExercises);

router.get("/:name", getExercise);

router.post("/", createExercise);

router.delete("/:id", deleteExercise);

router.put("/:id", updateExercise);

export default router;
