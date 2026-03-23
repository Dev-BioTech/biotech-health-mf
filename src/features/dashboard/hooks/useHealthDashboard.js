import { useState, useEffect } from "react";
import { healthService } from "@shared/services/healthService";
import { authUtils } from "@shared/utils/auth";

export const useHealthDashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentTreatments, setRecentTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const farmId = authUtils.getSelectedFarmId();

        if (!farmId) {
          setError("No se ha seleccionado ninguna granja.");
          setLoading(false);
          return;
        }

        // farmId is injected automatically by apiClient interceptor via X-Farm-Id header.
        // Do NOT pass farmId as argument to these service methods.
        const [statsData, eventsData, treatmentsData] = await Promise.all([
          healthService.getDashboardStats(),
          healthService.getUpcomingEvents(4),
          healthService.getRecentTreatments(4),
        ]);

        setStats(statsData);
        setUpcomingEvents(Array.isArray(eventsData) ? eventsData : []);
        setRecentTreatments(Array.isArray(treatmentsData) ? treatmentsData : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error al cargar datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    upcomingEvents,
    recentTreatments,
    loading,
    error,
  };
};
