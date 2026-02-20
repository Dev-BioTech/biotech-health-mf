import apiClient from "../utils/apiClient";

// Mock data
// Mock data with dynamic dates to ensure they appear in the current calendar
const now = new Date();
const currentMonthStr = String(now.getMonth() + 1).padStart(2, "0");
const currentYear = now.getFullYear();

const MOCK_HEALTH_EVENTS = [
  {
    id: "1",
    animalId: "101",
    animalName: "Vaca Luna",
    earTag: "COL-001",
    eventType: "Vacunación",
    type: "Vacunación", // Compatibility
    date: `${currentYear}-${currentMonthStr}-15`,
    description: "Vacuna antiaftosa anual",
    diagnosis: "Mantenimiento preventivo",
    treatment: "Aftogan 5ml",
    status: "Pendiente",
    veterinarian: "Dr. García",
    nextVisit: `${currentYear}-${currentMonthStr}-28`,
    farmId: 1,
  },
  {
    id: "2",
    animalId: "102",
    animalName: "Toro Bravo",
    earTag: "COL-002",
    eventType: "Tratamiento",
    type: "Tratamiento", // Compatibility
    date: `${currentYear}-${currentMonthStr}-10`,
    description: "Desparasitación interna",
    diagnosis: "Parásitos detectados en chequeo",
    treatment: "Ivermectina 1%",
    status: "Completado",
    veterinarian: "Dr. Pérez",
    nextVisit: "",
    farmId: 1,
  },
  {
    id: "3",
    animalId: "103",
    animalName: "Ternera Estrella",
    earTag: "COL-003",
    eventType: "Vacunación",
    type: "Vacunación", // Compatibility
    date: `${currentYear}-${currentMonthStr}-22`,
    description: "Refuerzo esquema base",
    diagnosis: "Control de crecimiento",
    treatment: "Multivitamínico",
    status: "Pendiente",
    veterinarian: "Dra. Martínez",
    nextVisit: "",
    farmId: 1,
  },
];

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const healthService = {
  // POST /api/HealthEvent - Register a new health event
  createRecord: async (eventData) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API - creating health event");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newEvent = {
        id: String(MOCK_HEALTH_EVENTS.length + 1),
        ...eventData,
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

  // PUT /api/HealthEvent/{id} - Update an existing health event
  updateRecord: async (id, eventData) => {
    if (USE_MOCK_API) {
      console.log(`🧪 Using MOCK API - updating health event ${id}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_HEALTH_EVENTS.findIndex((e) => e.id == id);
      if (index !== -1) {
        MOCK_HEALTH_EVENTS[index] = {
          ...MOCK_HEALTH_EVENTS[index],
          ...eventData,
        };
        return MOCK_HEALTH_EVENTS[index];
      }
      throw new Error("Event not found");
    }
    try {
      const response = await apiClient.put(`/HealthEvent/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating health event ${id}:`, error);
      throw error;
    }
  },

  // GET /api/HealthEvent/farm - Get events by farm (Query: fromDate, toDate, eventType)
  getEventsByFarm: async (filters = {}) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API for farm health events");
      await new Promise((resolve) => setTimeout(resolve, 300));
      let events = [...MOCK_HEALTH_EVENTS];
      if (filters.eventType) {
        events = events.filter((e) => e.eventType === filters.eventType);
      }
      return events;
    }
    try {
      const params = new URLSearchParams();
      if (filters.farmId) params.append("farmId", filters.farmId);
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
        error,
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
        error,
      );
      throw error;
    }
  },

  // GET /api/HealthEvent/type/{type} - Get events by type
  getEventsByType: async (type, filters = {}) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API for events by type", { type, filters });
      await new Promise((resolve) => setTimeout(resolve, 300));
      let events = [...MOCK_HEALTH_EVENTS];
      if (type && type !== "all") {
        events = events.filter((e) => e.eventType === type);
      }
      return events;
    }
    try {
      const response = await apiClient.get(`/HealthEvent/type/${type}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching health events of type ${type}:`, error);
      throw error;
    }
  },

  // GET /api/HealthEvent/dashboard-stats - Get health dashboard statistics
  getDashboardStats: async (farmId) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API for dashboard stats", { farmId });
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        healthy: { value: 115, total: 120, trend: "+5" },
        treatment: { value: 3, trend: "-1" },
        vaccinesPending: { value: 5, trend: "" },
        critical: { value: 2, trend: "" },
      };
    }
    try {
      const response = await apiClient.get(`/HealthEvent/dashboard-stats`, {
        params: { farmId },
      });
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

  // GET /api/HealthEvent/upcoming - Get upcoming health events/treatments
  getUpcomingEvents: async (farmId) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API for upcoming events", { farmId });
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_HEALTH_EVENTS.slice(0, 3);
    }
    try {
      const response = await apiClient.get("/HealthEvent/upcoming", {
        params: { farmId },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // GET /api/HealthEvent/recent-treatments - Get recent treatments
  getRecentTreatments: async (farmId) => {
    if (USE_MOCK_API) {
      console.log("🧪 Using MOCK API for recent treatments", { farmId });
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_HEALTH_EVENTS.filter((e) => e.eventType === "Tratamiento");
    }
    try {
      const response = await apiClient.get("/HealthEvent/recent-treatments", {
        params: { farmId },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },

  // Helper: Get vaccinations (events of type "Vaccination" or "Vacunación")
  getVaccinations: async (month, year, farmId) => {
    // We try both localized and English if mock, or just send to API
    return healthService.getEventsByType("Vacunación", { month, year, farmId });
  },

  // Compatibility alias for existing code
  getHealthRecords: async (filter = {}) => {
    if (filter.animalId)
      return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId) return healthService.getEventsByBatch(filter.batchId);

    // If type is 'all' or not specified, use general farm events
    if (!filter.type || filter.type === "all") {
      return healthService.getEventsByFarm(filter);
    }

    return healthService.getEventsByType(filter.type, filter);
  },
};

export default healthService;
