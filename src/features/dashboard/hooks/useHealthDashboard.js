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

        const [statsData, eventsData, treatmentsData] = await Promise.all([
          healthService.getDashboardStats(farmId),
          healthService.getUpcomingEvents(farmId),
          healthService.getRecentTreatments(farmId),
        ]);

        setStats(statsData);
        setUpcomingEvents(eventsData);
        setRecentTreatments(treatmentsData);
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
