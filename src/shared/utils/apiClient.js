import axios from "axios";

// Get API URL from environment or use mock mode
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || "https://api-gateway-bio-tech.up.railway.app/api";

// API client configured for the Gateway
const apiClient = axios.create({
  baseURL: USE_MOCK_API ? "http://localhost:9999/mock-api" : API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token in each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData?.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
