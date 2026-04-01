import axios from "axios";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const getTasks = () => axios.get(`/tasks`);
export const createTask = (data) => axios.post(`/tasks`, data);
export const updateTask = (id, data) => axios.put(`/tasks/${id}`, data);
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);
export const parseTaskAI = (text) => axios.post(`/ai/parse-task`, { text });
export const getDailyPlan = () => axios.get(`/ai/daily-plan`);
export const getDailyReview = () => axios.get(`/ai/daily-review`);
export const getStats = () => axios.get(`/tasks/stats`);
export const registerUser = (data) => axios.post(`/auth/register`, data);
export const loginUser    = (data) => axios.post(`/auth/login`, data);
export const getMe        = ()     => axios.get(`/auth/me`);