import sharedHealthService from "@shared/services/healthService";

export const healthService = {
  // Map or delegate to shared service
  createHealthEvent: sharedHealthService.createRecord,
  getEventsByFarm: (farmId) => sharedHealthService.getEventsByFarm({ farmId }),
  getEventsByAnimal: sharedHealthService.getEventsByAnimal,
  getEventsByBatch: sharedHealthService.getEventsByBatch,
  getEventsByType: sharedHealthService.getEventsByType,
};

export default healthService;
