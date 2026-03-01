import apiClient from "../utils/apiClient";

export const healthService = {
  // ── POST /api/HealthEvent ──────────────────────────────────────────────
  createRecord: async (eventData) => {
    const response = await apiClient.post("/HealthEvent", eventData);
    return response.data;
  },

  // ── GET /api/HealthEvent/farm ──────────────────────────────────────────
  // Query: page, pageSize
  getEventsByFarm: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.pageSize) params.append("pageSize", filters.pageSize);
    const qs = params.toString();
    const response = await apiClient.get(
      `/HealthEvent/farm${qs ? `?${qs}` : ""}`,
    );
    return response.data;
  },

  // ── GET /api/HealthEvent/animal/{animalId} ────────────────────────────
  getEventsByAnimal: async (animalId, params = {}) => {
    const response = await apiClient.get(`/HealthEvent/animal/${animalId}`, {
      params,
    });
    return response.data;
  },

  // ── GET /api/HealthEvent/batch/{batchId} ──────────────────────────────
  getEventsByBatch: async (batchId, params = {}) => {
    const response = await apiClient.get(`/HealthEvent/batch/${batchId}`, {
      params,
    });
    return response.data;
  },

  // ── GET /api/HealthEvent/type/{type} ──────────────────────────────────
  getEventsByType: async (type, params = {}) => {
    const response = await apiClient.get(`/HealthEvent/type/${type}`, {
      params,
    });
    return response.data;
  },

  // ── GET /api/HealthEvent/dashboard-stats ──────────────────────────────
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/HealthEvent/dashboard-stats");
      return response.data;
    } catch (error) {
      console.warn("Error getting dashboard stats:", error);
      return {
        healthy: { value: 0, total: 0, trend: "" },
        treatment: { value: 0, trend: "" },
        vaccinesPending: { value: 0, trend: "" },
        critical: { value: 0, trend: "" },
      };
    }
  },

  // ── GET /api/HealthEvent/upcoming ─────────────────────────────────────
  getUpcomingEvents: async (limit) => {
    try {
      const response = await apiClient.get("/HealthEvent/upcoming", {
        params: limit ? { limit } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // ── GET /api/HealthEvent/recent-treatments ────────────────────────────
  getRecentTreatments: async (limit) => {
    try {
      const response = await apiClient.get("/HealthEvent/recent-treatments", {
        params: limit ? { limit } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },

  // ── Helpers / Aliases ─────────────────────────────────────────────────
  getVaccinations: async (month, year) => {
    return healthService.getEventsByType("Vacunación", { month, year });
  },

  getHealthRecords: async (filter = {}) => {
    if (filter.animalId)
      return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId) return healthService.getEventsByBatch(filter.batchId);
    if (filter.type && filter.type !== "all") {
      return healthService.getEventsByType(filter.type, filter);
    }
    return healthService.getEventsByFarm(filter);
  },
};

export default healthService;
