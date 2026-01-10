import apiClient from "../../../shared/utils/apiClient";

export const healthService = {
  // Create a new health event
  // POST /api/HealthEvent
  createHealthEvent: async (eventData) => {
    const response = await apiClient.post("/HealthEvent", eventData);
    return response.data;
  },

  // Get health events by Farm ID
  // GET /api/HealthEvent/farm/{farmId}
  getEventsByFarm: async (farmId) => {
    const response = await apiClient.get(`/HealthEvent/farm/${farmId}`);
    return response.data;
  },

  // Get health events by Animal ID
  // GET /api/HealthEvent/animal/{animalId}
  getEventsByAnimal: async (animalId) => {
    const response = await apiClient.get(`/HealthEvent/animal/${animalId}`);
    return response.data;
  },

  // Get health events by Batch ID
  // GET /api/HealthEvent/batch/{batchId}
  getEventsByBatch: async (batchId) => {
    const response = await apiClient.get(`/HealthEvent/batch/${batchId}`);
    return response.data;
  },

  // Get health events by Event Type
  // GET /api/HealthEvent/type/{type}
  getEventsByType: async (type) => {
    const response = await apiClient.get(`/HealthEvent/type/${type}`);
    return response.data;
  },
};

export default healthService;
