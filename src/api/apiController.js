import axios from "axios";
import { auth } from "../Firestore/firestore";

const authStrategy = async (config) => {
  try {
    const token = await auth.currentUser.getIdToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    // Handle errors during token retrieval
    console.error("Error retrieving token:", error);
    return config; // Or throw an error, depending on your error handling
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  //   timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    // Make the interceptor async
    if (config.useAuth !== false) {
      return await authStrategy(config); // Await the async authStrategy
    }
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

const apiController = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default apiController;
