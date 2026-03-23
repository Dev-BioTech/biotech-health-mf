import apiClient from "../utils/apiClient";

// Maps Spanish UI types -> English backend EventType enum values
const typeMapping = {
  "Vacunación": "Vaccination",
  "Chequeo": "Check-up",
  "Tratamiento": "Treatment",
  "Desparasitación": "Treatment",
  "Emergencia": "Treatment",
  "Enfermedad": "Disease",
};

// Maps Spanish UI statuses -> English backend Status enum values
const statusMapping = {
  "Pendiente": "Pending",
  "En Curso": "InProgress",
  "Completado": "Completed",
  "Cancelado": "Cancelled",
  "pending": "Pending",
  "completed": "Completed",
};

/**
 * Builds the payload for POST/PUT requests.
 * Maps frontend field names to the backend DTO/Command property names.
 */
const buildPayload = (eventData) => ({
  ...eventData,
  // Type mapping (Spanish -> English enum)
  eventType: typeMapping[eventData.type] || typeMapping[eventData.eventType] || eventData.eventType || eventData.type,
  // Status mapping
  status: statusMapping[eventData.status] || eventData.status,
  // Field name mapping (frontend -> backend DTO)
  eventDate: eventData.eventDate || eventData.date || new Date().toISOString().split("T")[0],
  veterinarianName: eventData.veterinarianName || eventData.veterinarian,
  disease: eventData.disease || eventData.diagnosis,
  notes: eventData.notes || eventData.description,
  animalName: eventData.animalName || eventData.animal,
  requiresFollowUp: eventData.requiresFollowUp ?? false,
});

/**
 * Normalizes the backend HealthEventResponse to frontend-friendly field names.
 * Backend returns: EventType, EventDate, VeterinarianName, Disease, Notes
 * Frontend expects: type, date, veterinarian, diagnosis, description
 */
const normalizeRecord = (record) => {
  if (!record) return record;
  return {
    ...record,
    // Keep both forms for compatibility
    type: record.type || record.eventType,
    date: record.date || record.eventDate,
    veterinarian: record.veterinarian || record.veterinarianName,
    diagnosis: record.diagnosis || record.disease,
    description: record.description || record.notes,
    animal: record.animal || record.animalName,
  };
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data.map(normalizeRecord);
  if (Array.isArray(data?.healthEvents)) return data.healthEvents.map(normalizeRecord);
  if (Array.isArray(data?.items)) return data.items.map(normalizeRecord);
  if (Array.isArray(data?.data)) return data.data.map(normalizeRecord);
  return [];
};

export const healthService = {
  // ── POST /api/v1/health-event ─────────────────────────────────────────────
  createRecord: async (eventData) => {
    const payload = buildPayload(eventData);
    const response = await apiClient.post("/v1/health-event", payload);
    return response.data?.data || response.data;
  },

  // ── PUT /api/v1/health-event/{id} ─────────────────────────────────────────
  updateRecord: async (id, eventData) => {
    const payload = buildPayload(eventData);
    const response = await apiClient.put(`/v1/health-event/${id}`, payload);
    return response.data?.data || response.data;
  },

  // ── GET /api/v1/health-event/farm ─────────────────────────────────────────
  // FarmId is injected by apiClient interceptor via X-Farm-Id header
  getEventsByFarm: async (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    const response = await apiClient.get("/v1/health-event/farm", { params });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/health-event/animal/{animalId} ────────────────────────────
  getEventsByAnimal: async (animalId, filters = {}) => {
    const response = await apiClient.get(`/v1/health-event/animal/${animalId}`, {
      params: filters,
    });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/health-event/batch/{batchId} ──────────────────────────────
  getEventsByBatch: async (batchId, filters = {}) => {
    const response = await apiClient.get(`/v1/health-event/batch/${batchId}`, {
      params: filters,
    });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/health-event/type/{type} ──────────────────────────────────
  getEventsByType: async (type, filters = {}) => {
    const mappedType = typeMapping[type] || type;
    const { page, pageSize } = filters;
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    const response = await apiClient.get(`/v1/health-event/type/${mappedType}`, {
      params,
    });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/health-event/dashboard-stats ──────────────────────────────
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/v1/health-event/dashboard-stats");
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Error getting dashboard stats:", error);
      return {
        totalEvents: 0,
        totalCost: 0,
        recentSickAnimalsCount: 0,
      };
    }
  },

  // ── GET /api/v1/health-event/upcoming ─────────────────────────────────────
  getUpcomingEvents: async (limit) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      const response = await apiClient.get("/v1/health-event/upcoming", { params });
      const data = response.data?.data || response.data;
      return normalizeList(data);
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // ── GET /api/v1/health-event/recent-treatments ────────────────────────────
  getRecentTreatments: async (limit) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      const response = await apiClient.get("/v1/health-event/recent-treatments", { params });
      const data = response.data?.data || response.data;
      return normalizeList(data);
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },

  // ── Alias: Vaccinations (type = Vaccination) ───────────────────────────────
  getVaccinations: async (month, year) => {
    return healthService.getEventsByType("Vacunación", { pageSize: 100 });
  },

  // ── Alias: Health Records (resolves correct endpoint based on filter) ──────
  getHealthRecords: async (filter = {}) => {
    if (filter.animalId) return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId) return healthService.getEventsByBatch(filter.batchId);
    if (filter.type && filter.type !== "all") {
      return healthService.getEventsByType(filter.type, filter);
    }
    return healthService.getEventsByFarm(filter);
  },
};

export default healthService;
