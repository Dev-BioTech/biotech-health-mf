import axios from "axios";

// API client configured for the Gateway
const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_GATEWAY_URL ||
    "https://api-gateway-bio-tech.up.railway.app/api",
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
        
        // Add Authorization header with JWT token
        if (authData?.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
        
        // Add X-Farm-Id header if selectedFarm exists (backend expects X-Farm-Id)
        if (authData?.state?.selectedFarm?.id) {
          config.headers['X-Farm-Id'] = authData.state.selectedFarm.id.toString();
        }
        
        // Add X-User-Id header if user exists
        if (authData?.state?.user?.id) {
          config.headers['X-User-Id'] = authData.state.user.id.toString();
        }
        
        // Add X-User-Email header if user email exists
        if (authData?.state?.user?.email) {
          config.headers['X-User-Email'] = authData.state.user.email;
        }
        
        // NOTE: X-Gateway-Secret commented out - not all services have it configured
        // config.headers['X-Gateway-Secret'] = 'your-shared-secret-between-gateway-and-microservice';
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
      // Check if it's a token issue or just missing farm
      const authStorage = localStorage.getItem("auth-storage");
      let shouldLogout = true;
      
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          // If we have a valid token but no farm, don't logout, just let the error propagate
          if (authData?.state?.token && !authData?.state?.selectedFarm) {
            console.warn("401 error: No farm selected");
            shouldLogout = false;
          }
        } catch (e) {
          console.error("Error checking auth:", e);
        }
      }
      
      if (shouldLogout) {
        // Invalid or expired token
        console.error("401 Unauthorized - clearing session");
        localStorage.removeItem("auth-storage");
        window.dispatchEvent(new Event("auth-change"));
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
