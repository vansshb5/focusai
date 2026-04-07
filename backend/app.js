import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();
console.log("NEW CORS CONFIG LOADED");
const app = express();
app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming origin:", origin);

    const allowed = [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://focusai-amber.vercel.app"
    ];

    if (
      !origin ||
      allowed.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      console.log("CORS allowed");
      callback(null, true);
    } else {
      console.log("CORS blocked:", origin);
      callback(new Error(`Blocked by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());

app.use("/auth",  authRoutes);
app.use("/tasks", protect, taskRoutes);
app.use("/ai",    protect, aiRoutes);

app.get("/", (req, res) => res.send("FocusAI server running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));