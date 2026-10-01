import express from "express";
import { createExercise } from "../controllers/exerciseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware)

// router.get("/", login);

router.post("/", createExercise);

// router.put("/", login);

// router.delete("/", login);

export default router;
