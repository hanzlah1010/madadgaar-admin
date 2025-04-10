import axios, { InternalAxiosRequestConfig } from "axios";
import { auth } from "../Firestore/firestore";
import { User } from "firebase/auth";

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  useAuth?: boolean;
}

const authStrategy = async (config: AuthRequestConfig) => {
  try {
    if (!auth?.currentUser) throw new Error("No user found");
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
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   timeout: 5000,
});

api.interceptors.request.use(
  async (config: AuthRequestConfig) => {
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
  get: (url: string, config = {}) => api.get(url, config),
  post: (url: string, data: any, config = {}) => api.post(url, data, config),
  put: (url: string, data: any, config = {}) => api.put(url, data, config),
  delete: (url: string, config = {}) => api.delete(url, config),
};

export default apiController;
