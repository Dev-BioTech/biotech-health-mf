import apiClient from "../utils/apiClient";

/**
 * Animal Service for Health Microfrontend
 * Fetches real animal data from the Animals API via Gateway
 */
export const animalService = {
  /**
   * Fetch animal details by ID
   * @param {string|number} id - The animal ID (visual code or database ID)
   * @returns {Promise<Object>} Animal data
   */
  getAnimalById: async (id) => {
    try {
      if (!id) return null;
      // We use the Gateway endpoint for animals
      const response = await apiClient.get(`/v1/animals/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching animal ${id}:`, error);
      throw error;
    }
  }
};

export default animalService;
