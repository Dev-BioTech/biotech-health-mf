import { useState, useEffect } from "react";
import { healthService } from "../../../shared/services/healthService";
import { authUtils } from "../../../shared/utils/auth";

export const useVaccination = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        setLoading(true);
        const farmId = authUtils.getSelectedFarmId();
        const data = await healthService.getVaccinations(
          currentMonth,
          currentYear,
          farmId,
        );
        setVaccinations(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching vaccinations:", err);
        setError("Error al cargar calendario de vacunación");
      } finally {
        setLoading(false);
      }
    };

    fetchVaccinations();
  }, [currentMonth, currentYear]);

  const scheduleVaccination = async (vaccinationData) => {
    // Implementar lógica de programación
    console.log("Programando vacunación:", vaccinationData);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const upcomingVaccinations = vaccinations
    .filter((v) => v.status === "pending")
    .slice(0, 5);

  const completedThisMonth = vaccinations.filter(
    (v) => v.status === "completed",
  ).length; // Simulado, debería revisar fecha

  return {
    vaccinations,
    upcomingVaccinations,
    completedThisMonth,
    loading,
    error,
    currentMonth,
    currentYear,
    nextMonth,
    previousMonth,
    scheduleVaccination,
  };
};
