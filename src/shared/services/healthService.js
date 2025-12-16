import apiClient from "../utils/apiClient";

export const healthService = {
  // Create a new health event
  createHealthEvent: async (eventData) => {
    try {
      // POST /api/HealthEvent
      const response = await apiClient.post("/HealthEvent", eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating health event:", error);
      throw error;
    }
  },

  // Get health events by Farm ID
  getEventsByFarm: async (farmId) => {
    try {
      // GET /api/HealthEvent/farm/{farmId}
      const response = await apiClient.get(`/HealthEvent/farm/${farmId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching health events for farm ${farmId}:`, error);
      throw error;
    }
  },

  // Get health events by Animal ID
  getEventsByAnimal: async (animalId) => {
    try {
      // GET /api/HealthEvent/animal/{animalId}
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

  // Get health events by Batch ID
  getEventsByBatch: async (batchId) => {
    try {
      // GET /api/HealthEvent/batch/{batchId}
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

  // Get health events by Event Type
  getEventsByType: async (type) => {
    try {
      // GET /api/HealthEvent/type/{type}
      const response = await apiClient.get(`/HealthEvent/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching health events of type ${type}:`, error);
      throw error;
    }
  },

  // Compatibility alias (if needed by existing code, though upgrading UI is better)
  getHealthRecords: async (filter = {}) => {
    if (filter.farmId) return healthService.getEventsByFarm(filter.farmId);
    if (filter.animalId)
      return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId) return healthService.getEventsByBatch(filter.batchId);
    if (filter.type) return healthService.getEventsByType(filter.type);
    return [];
  },
};

export default healthService;
