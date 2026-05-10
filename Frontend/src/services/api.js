import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Interview
export const startInterview = () => API.post("/interview/start");
export const getCurrentQuestion = (id) => API.get(`/interview/${id}/question`);
export const submitCode = (id, data) => API.post(`/interview/${id}/submit`, data);
export const getReport = (id) => API.get(`/interview/report/${id}`);
export const runCode = (data) => API.post("/code/run", data);

// Speech
export const saveSpeech = (id, text) => API.post(`/speech/${id}`, { text });

export default API;