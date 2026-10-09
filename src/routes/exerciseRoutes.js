import express from "express";
import * as exerciseController from "../controllers/exerciseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/?updatedSince", exerciseController.getExercises);

router.get("/:name", exerciseController.getExercise);

router.post("/", exerciseController.createExercise);

router.delete("/:id", exerciseController.deleteExercise);

router.put("/:id", exerciseController.updateExercise);

export default router;
