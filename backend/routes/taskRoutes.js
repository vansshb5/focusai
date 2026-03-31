import express from "express";
import { createTask, getTasks, updateTask, deleteTask, getStats } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/stats", getStats);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;