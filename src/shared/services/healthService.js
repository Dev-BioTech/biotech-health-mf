import apiClient from "../utils/apiClient";

// Mock data
const MOCK_HEALTH_EVENTS = [
  {
    id: "1",
    animalId: "1",
    earTag: "COL-001",
    eventType: "Vacunación",
    date: "2025-12-15",
    description: "Vacuna antiaftosa",
    veterinarian: "Dr. García"
  },
  {
    id: "2",
    animalId: "2",
    earTag: "COL-002",
    eventType: "Tratamiento",
    date: "2025-12-20",
    description: "Desparasitación",
    veterinarian: "Dr. Pérez"
  }
];

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const healthService = {
  // POST /api/HealthEvent - Register a new health event
  createHealthEvent: async (eventData) => {
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API - creating health event');
      await new Promise(resolve => setTimeout(resolve, 300));
      const newEvent = {
        id: String(MOCK_HEALTH_EVENTS.length + 1),
        ...eventData,
        date: new Date().toISOString().split('T')[0]
      };
      MOCK_HEALTH_EVENTS.push(newEvent);
      return newEvent;
    }
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
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for farm health events');
      await new Promise(resolve => setTimeout(resolve, 300));
      let events = [...MOCK_HEALTH_EVENTS];
      if (filters.eventType) {
        events = events.filter(e => e.eventType === filters.eventType);
      }
      return events;
    }
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
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for dashboard stats');
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        healthy: {
          value: 115,
          total: 120,
          trend: "+5"
        },
        treatment: {
          value: 3,
          trend: "-1"
        },
        vaccinesPending: {
          value: 5,
          trend: ""
        },
        critical: {
          value: 2,
          trend: ""
        }
      };
    }
    try {
      const response = await apiClient.get("/HealthEvent/dashboard-stats");
      return response.data;
    } catch (error) {
      console.warn("Error getting dashboard stats:", error);
      // Fallback structure in case of error
      return {
        healthy: { value: 0, total: 0, trend: "" },
        treatment: { value: 0, trend: "" },
        vaccinesPending: { value: 0, trend: "" },
        critical: { value: 0, trend: "" }
      };
    }
  },

  // GET /api/HealthEvent/upcoming - Get upcoming health events/treatments
  getUpcomingEvents: async () => {
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for upcoming events');
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_HEALTH_EVENTS.slice(0, 3);
    }
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
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for recent treatments');
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_HEALTH_EVENTS.filter(e => e.eventType === 'Tratamiento');
    }
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
