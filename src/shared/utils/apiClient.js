import axios from "axios";

// Get API URL from environment
const API_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://api.biotech.159.54.176.254.nip.io/api";

// API client configured for the Gateway
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: attach JWT token to every request.
// The backend reads farmId from the JWT claims (GatewayAuthenticationService.GetFarmId()),
// so we do NOT need to inject farmId as a query param or header — it comes from the token.
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor: handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear session if there is genuinely no token.
      // Resource-level 401s (farm context issues) must NOT log the user out.
      try {
        const parsed = JSON.parse(localStorage.getItem("auth-storage") || "{}");
        if (!parsed?.state?.token) {
          localStorage.removeItem("auth-storage");
          window.dispatchEvent(new Event("auth-change"));
        }
      } catch {
        localStorage.removeItem("auth-storage");
        window.dispatchEvent(new Event("auth-change"));
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
