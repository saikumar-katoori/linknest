import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linknest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — clear token but don't force reload
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("linknest_token");
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// Links
export const getLinks = (params) => api.get(`${API}/api/links`, { params });
export const createLink = (data) => api.post(`${API}/api/links`, data);
export const updateLink = (id, data) => api.put(`${API}/api/links/${id}`, data);
export const deleteLink = (id) => api.delete(`${API}/api/links/${id}`);
export const getCategories = () => api.get(`${API}/api/links/categories`);

export default api;
