import apiClient from "../utils/apiClient";

export const healthService = {
  // POST /api/HealthEvent - Register a new health event
  createHealthEvent: async (eventData) => {
    try {
      const response = await apiClient.post("/HealthEvent", eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating health event:", error);
      throw error;
    }
  },

  // GET /api/HealthEvent/farm - Get events by farm (Query: fromDate, toDate, eventType)
  getEventsByFarm: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);
      if (filters.eventType) params.append("eventType", filters.eventType);

      const url = params.toString()
        ? `/HealthEvent/farm?${params.toString()}`
        : "/HealthEvent/farm";
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching health events for farm:", error);
      throw error;
    }
  },

  // GET /api/HealthEvent/animal/{animalId} - Get events for an animal
  getEventsByAnimal: async (animalId) => {
    try {
      const response = await apiClient.get(`/HealthEvent/animal/${animalId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching health events for animal ${animalId}:`,
        error
      );
      throw error;
    }
  },

  // GET /api/HealthEvent/batch/{batchId} - Get events for a batch
  getEventsByBatch: async (batchId) => {
    try {
      const response = await apiClient.get(`/HealthEvent/batch/${batchId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching health events for batch ${batchId}:`,
        error
      );
      throw error;
    }
  },

  // GET /api/HealthEvent/type/{type} - Get events by type
  getEventsByType: async (type) => {
    try {
      const response = await apiClient.get(`/HealthEvent/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching health events of type ${type}:`, error);
      throw error;
    }
  },

  // GET /api/HealthEvent/dashboard-stats - Get health dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/HealthEvent/dashboard-stats");
      return response.data;
    } catch (error) {
      console.warn("Error getting dashboard stats:", error);
      // Fallback structure in case of error
      return {
        sickAnimals: 0,
        treatmentsActive: 0,
        vaccinationsPending: 0,
        healthIndex: 100,
      };
    }
  },

  // GET /api/HealthEvent/upcoming - Get upcoming health events/treatments
  getUpcomingEvents: async () => {
    try {
      const response = await apiClient.get("/HealthEvent/upcoming");
      return response.data;
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // GET /api/HealthEvent/recent-treatments - Get recent treatments
  getRecentTreatments: async () => {
    try {
      const response = await apiClient.get("/HealthEvent/recent-treatments");
      return response.data;
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },

  // Helper: Get vaccinations (events of type "Vaccination")
  getVaccinations: async (filters = {}) => {
    return healthService.getEventsByType("Vaccination");
  },

  // Compatibility alias for existing code
  getHealthRecords: async (filter = {}) => {
    if (filter.animalId)
      return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId) return healthService.getEventsByBatch(filter.batchId);
    if (filter.type) return healthService.getEventsByType(filter.type);
    // Default to farm events with filters
    return healthService.getEventsByFarm(filter);
  },
};

export default healthService;
