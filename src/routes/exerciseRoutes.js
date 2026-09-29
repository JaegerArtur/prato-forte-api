import express from "express";
import { createExercise } from "../controllers/exerciseController.js";

const router = express.Router();

// router.get("/", login);

router.post("/", createExercise);

// router.put("/", login);

// router.delete("/", login);

export default router;
