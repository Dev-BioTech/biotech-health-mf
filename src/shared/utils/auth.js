/**
 * Utility to consistently access authentication and farm state across the microfrontend.
 * This reads from the shared 'auth-storage' used by the Shell and Auth MF.
 */

export const authUtils = {
  /**
   * Retrieves the current authentication state from localStorage.
   */
  getAuthState: () => {
    const storage = localStorage.getItem("auth-storage");
    if (!storage) return null;
    try {
      const parsed = JSON.parse(storage);
      return parsed?.state || null;
    } catch (error) {
      console.error("Error parsing auth-storage:", error);
      return null;
    }
  },

  /**
   * Returns the ID of the currently selected farm.
   */
  getSelectedFarmId: () => {
    const state = authUtils.getAuthState();
    return state?.selectedFarm?.id || null;
  },

  /**
   * Returns the JWT token for API calls.
   */
  getToken: () => {
    const state = authUtils.getAuthState();
    return state?.token || null;
  },
};

export default authUtils;
