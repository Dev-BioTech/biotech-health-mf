import { create } from "zustand";
import { healthService } from "@shared/services/healthService";

export const useHealthStore = create((set, get) => ({
  records: [],
  loading: false,
  error: null,

  // Actions
  fetchEventsByFarm: async (farmId) => {
    set({ loading: true, error: null });
    try {
      const data = await healthService.getEventsByFarm(farmId);
      set({ records: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Error fetching health events",
        loading: false,
      });
      console.error(error);
    }
  },

  fetchEventsByAnimal: async (animalId) => {
    set({ loading: true, error: null });
    try {
      const data = await healthService.getEventsByAnimal(animalId);
      set({ records: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Error fetching animal health events",
        loading: false,
      });
      console.error(error);
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const newEvent = await healthService.createHealthEvent(eventData);
      set((state) => ({
        records: [...state.records, newEvent],
        loading: false,
      }));
      return newEvent;
    } catch (error) {
      set({
        error: error.message || "Error creating health event",
        loading: false,
      });
      throw error;
    }
  },

  setRecords: (records) => set({ records }),
  setLoading: (loading) => set({ loading }),
}));
