import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({ 
  baseURL: BASE_URL ,
  withCredentials: true
});

// ✅ Attach token to the api instance, not the global axios
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTasks       = ()       => api.get("/tasks");
export const createTask     = (data)   => api.post("/tasks", data);
export const updateTask     = (id, d)  => api.put(`/tasks/${id}`, d);
export const deleteTask     = (id)     => api.delete(`/tasks/${id}`);
export const parseTaskAI    = (text)   => api.post("/ai/parse-task", { text });
export const getDailyPlan   = ()       => api.get("/ai/daily-plan");
export const getDailyReview = ()       => api.get("/ai/daily-review");
export const getStats       = ()       => api.get("/tasks/stats");
export const decomposeGoal  = (goal)   => api.post("/ai/decompose-goal", { goal });
export const registerUser   = (data)   => api.post("/auth/register", data);
export const loginUser      = (data)   => api.post("/auth/login", data);
export const getMe          = ()       => api.get("/auth/me");