import apiClient from "../utils/apiClient";
import { animalService } from "./animalService";

// Maps Spanish UI types -> English backend EventType enum values
// Validated against the real backend (PascalCase enums)
const typeMapping = {
  "Vacunación":    "Vaccination",
  "Chequeo":       "Check-up",
  "Tratamiento":   "Treatment",
  "Desparasitación": "Treatment",
  "Emergencia":    "Treatment",
  "Enfermedad":    "Disease",
  "Medicación":    "Medication",
  "Cirugía":       "Surgery",
  "Lesión":        "Injury",
  "Diagnóstico":   "Diagnosis",
};

// Maps Spanish UI statuses -> English backend Status enum values
const statusMapping = {
  "Pendiente":  "Pending",
  "En Curso":   "InProgress",
  "Completado": "Completed",
  "Cancelado":  "Cancelled",
  "pending":    "Pending",
  "completed":  "Completed",
};

/**
 * Builds the payload for POST/PUT requests.
 * Maps frontend field names to the backend DTO/Command property names.
 * NOTE: backend uses "eventType" (not "type") and "eventDate" (YYYY-MM-DD, no UTC Z).
 */
const buildPayload = (eventData) => ({
  animalId: eventData.animalId ? Number(eventData.animalId) : null,
  eventType:
    typeMapping[eventData.type] ||
    typeMapping[eventData.eventType] ||
    eventData.type ||
    eventData.eventType,
  status: statusMapping[eventData.status] || eventData.status,
  eventDate:
    eventData.date ||
    eventData.eventDate ||
    new Date().toISOString().split("T")[0],
  veterinarianName: eventData.veterinarian || eventData.veterinarianName,
  disease: eventData.diagnosis || eventData.disease,
  medication: eventData.treatment || eventData.medication || eventData.treatmentNotes,
  notes: eventData.description || eventData.notes,
  requiresFollowUp: eventData.requiresFollowUp ?? false,
});

/**
 * Normalizes the backend HealthEventResponse to frontend-friendly field names.
 * Backend returns: eventType, eventDate, veterinarianName, disease, notes, cost, treatment
 * Frontend expects: type, date, veterinarian, diagnosis, description, treatment
 * NOTE: "estimatedCost" in the request is stored as "cost" in the response.
 *       "description" in the request is stored as "notes" in the response.
 */
const normalizeRecord = (record) => {
  if (!record) return record;
  return {
    ...record,
    // Keep both forms for compatibility
    type:         record.type || record.eventType,
    date:         record.date || record.eventDate,
    veterinarian: record.veterinarian || record.veterinarianName,
    diagnosis:    record.diagnosis || record.disease,
    description:  record.description || record.notes,
    treatment:    record.treatment || record.medication || record.treatmentNotes || "",
    animal:       record.animal || record.animalName,
    animalName:   record.animalName || record.animal,
    cost:         record.cost ?? record.estimatedCost,
  };
};

/**
 * Normalizes API list responses and enriches records with animal names.
 * Confirmed backend response shapes for health endpoints:
 *   - Array directly (GET /farm, /animal, /type, /upcoming, /recent-treatments)
 *   - { data: [] }   (wrapped array)
 *   - { data: {} }   (single object — POST, PUT, dashboard-stats — handled elsewhere)
 */

// In-memory cache so we don't re-fetch the same animal within a session
const _animalNameCache = {};

const normalizeList = async (data) => {
  let records = [];
  if (Array.isArray(data)) records = data.map(normalizeRecord);
  else if (Array.isArray(data?.data)) records = data.data.map(normalizeRecord);
  else if (Array.isArray(data?.healthEvents)) records = data.healthEvents.map(normalizeRecord);

  // Collect ALL unique animalIds (always resolve from API, not from stale form data)
  const uniqueIds = [
    ...new Set(records.filter((r) => r.animalId).map((r) => r.animalId)),
  ];

  // Fetch any IDs not yet in cache
  const idsToFetch = uniqueIds.filter((id) => !_animalNameCache[id]);
  if (idsToFetch.length > 0) {
    await Promise.all(
      idsToFetch.map(async (id) => {
        try {
          const animal = await animalService.getAnimalById(id);
          _animalNameCache[id] =
            animal?.name || animal?.nombre || animal?.identifier || `Animal #${id}`;
        } catch {
          _animalNameCache[id] = `Animal #${id}`;
        }
      })
    );
  }

  // Apply resolved animal names — always prefer the API-resolved name over form data
  return records.map((r) => ({
    ...r,
    animalName: _animalNameCache[r.animalId] || r.animalName || r.animal || null,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// All endpoints use PascalCase path: /v1/HealthEvent  (validated vs real backend)
// ─────────────────────────────────────────────────────────────────────────────

export const healthService = {
  // ── POST /api/v1/HealthEvent ──────────────────────────────────────────────
  createRecord: async (eventData) => {
    const payload = buildPayload(eventData);
    const response = await apiClient.post("/v1/HealthEvent", payload);
    return response.data?.data || response.data;
  },

  // ── PUT /api/v1/HealthEvent/{id} ──────────────────────────────────────────
  updateRecord: async (id, eventData) => {
    const payload = buildPayload(eventData);
    const response = await apiClient.put(`/v1/HealthEvent/${id}`, payload);
    return response.data?.data || response.data;
  },

  // ── GET /api/v1/HealthEvent/farm ──────────────────────────────────────────
  // farmId is extracted from the JWT by the backend — NOT sent as a param.
  getEventsByFarm: async (filters = {}) => {
    const params = {};
    if (filters.page)     params.page     = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    const response = await apiClient.get("/v1/HealthEvent/farm", { params });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/HealthEvent/animal/{animalId} ─────────────────────────────
  getEventsByAnimal: async (animalId, filters = {}) => {
    const response = await apiClient.get(`/v1/HealthEvent/animal/${animalId}`, {
      params: filters,
    });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/HealthEvent/batch/{batchId} ───────────────────────────────
  getEventsByBatch: async (batchId, filters = {}) => {
    const response = await apiClient.get(`/v1/HealthEvent/batch/${batchId}`, {
      params: filters,
    });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/HealthEvent/type/{type} ───────────────────────────────────
  getEventsByType: async (type, filters = {}) => {
    const mappedType = typeMapping[type] || type;
    const params = {};
    if (filters.page)     params.page     = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    const response = await apiClient.get(`/v1/HealthEvent/type/${mappedType}`, { params });
    const data = response.data?.data || response.data;
    return normalizeList(data);
  },

  // ── GET /api/v1/HealthEvent/dashboard-stats ───────────────────────────────
  // Returns: { totalEvents, totalCost, recentSickAnimalsCount, calculatedAt }
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/v1/HealthEvent/dashboard-stats");
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

  // ── GET /api/v1/HealthEvent/upcoming ──────────────────────────────────────
  // Returns events with nextFollowUpDate scheduled. Empty if none exist.
  getUpcomingEvents: async (limit) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      const response = await apiClient.get("/v1/HealthEvent/upcoming", { params });
      const data = response.data?.data || response.data;
      return normalizeList(data);
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // ── GET /api/v1/HealthEvent/recent-treatments ─────────────────────────────
  // Returns events ordered by createdAt DESC.
  getRecentTreatments: async (limit) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      const response = await apiClient.get("/v1/HealthEvent/recent-treatments", { params });
      const data = response.data?.data || response.data;
      return normalizeList(data);
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },

  // ── Alias: Vaccinations (type = Vaccination) ──────────────────────────────
  getVaccinations: async (month, year) => {
    return healthService.getEventsByType("Vacunación", { pageSize: 100 });
  },

  // ── Alias: Health Records (routes to correct endpoint based on filter) ─────
  getHealthRecords: async (filter = {}) => {
    if (filter.animalId) return healthService.getEventsByAnimal(filter.animalId);
    if (filter.batchId)  return healthService.getEventsByBatch(filter.batchId);
    if (filter.type && filter.type !== "all") {
      return healthService.getEventsByType(filter.type, filter);
    }
    return healthService.getEventsByFarm(filter);
  },
};

export default healthService;
