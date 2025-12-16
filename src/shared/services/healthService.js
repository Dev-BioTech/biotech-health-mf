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

  // Dashboard Stats (Calculated from events for now or Mocked)
  // Dashboard Stats (Calculated from REAL events)
  getDashboardStats: async (farmId) => {
    try {
      if (!farmId) throw new Error("Farm ID required");

      const events = await healthService.getEventsByFarm(farmId);

      // Calculate stats based on eventType from backend
      const sickAnimals = events.filter(
        (e) => e.eventType === "SICKNESS" || e.eventType === "Enfermedad"
      ).length;
      const treatments = events.filter(
        (e) => e.eventType === "TREATMENT" || e.eventType === "Tratamiento"
      ).length;

      // Future vaccinations calculation
      const today = new Date();
      const vaccinationsPending = events.filter((e) => {
        const eventDate = new Date(e.eventDate);
        return (
          (e.eventType === "VACCINATION" || e.eventType === "Vacunación") &&
          eventDate >= today
        );
      }).length;

      return {
        sickAnimals,
        treatmentsActive: treatments,
        vaccinationsPending,
        healthIndex: events.length > 0 ? 95 : 100, // Mock index for now
      };
    } catch (error) {
      console.warn("Error getting dashboard stats (using fallback 0s):", error);
      return {
        sickAnimals: 0,
        treatmentsActive: 0,
        vaccinationsPending: 0,
        healthIndex: 100,
      };
    }
  },
  // Get Upcoming health events (Filtered from REAL API data)
  getUpcomingEvents: async (farmId) => {
    try {
      const events = await healthService.getEventsByFarm(farmId);
      const today = new Date();

      return events
        .filter((e) => new Date(e.eventDate) >= today) // Future events only
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) // Ascending order
        .slice(0, 5) // Top 5
        .map((e) => ({
          date: new Date(e.eventDate).toLocaleDateString(),
          event: e.notes || e.eventType, // Use notes or type
          priority: "medium", // Default
        }));
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },

  // Get Recent Treatments (Filtered from REAL API data)
  getRecentTreatments: async (farmId) => {
    try {
      const events = await healthService.getEventsByFarm(farmId);
      const today = new Date();

      return events
        .filter(
          (e) =>
            (e.eventType === "TREATMENT" || e.eventType === "Tratamiento") &&
            new Date(e.eventDate) <= today
        )
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)) // Descending order (newest first)
        .slice(0, 5) // Top 5
        .map((e) => ({
          animal: `Animal #${e.animalId}`, // We might need animal name if available
          treatment: e.notes || "Tratamiento General",
          date: new Date(e.eventDate).toLocaleDateString(),
          status: "success",
        }));
    } catch (error) {
      console.error("Error getting recent treatments:", error);
      return [];
    }
  },
};

export default healthService;
