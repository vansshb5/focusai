import axios from "axios";

export const getTasks = () => axios.get(`/tasks`);
export const createTask = (data) => axios.post(`/tasks`, data);
export const updateTask = (id, data) => axios.put(`/tasks/${id}`, data);
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);
export const parseTaskAI = (text) => axios.post(`/ai/parse-task`, { text });
export const getDailyPlan = () => axios.get(`/ai/daily-plan`);
export const getDailyReview = () => axios.get(`/ai/daily-review`);
export const getStats = () => axios.get(`/tasks/stats`);