import express from "express";
import { parseTask, getDailyPlan, getDailyReview } from "../controllers/aiController.js";

const router = express.Router();

router.post("/parse-task", parseTask);
router.get("/daily-plan", getDailyPlan);
router.get("/daily-review", getDailyReview);

export default router;