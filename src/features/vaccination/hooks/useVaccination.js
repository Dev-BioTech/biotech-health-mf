import { useState, useEffect } from "react";
import { healthService } from "@shared/services/healthService";
import { authUtils } from "@shared/utils/auth";
import alertService from "@shared/utils/alertService";

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
    try {
      setLoading(true);
      const farmId = authUtils.getSelectedFarmId();

      const payload = {
        ...vaccinationData,
        farmId: Number(farmId),
        eventType: "Vacunación",
        type: "Vacunación",
        animalName: vaccinationData.animal,
        diagnosis: "Vacunación Programada",
        treatment: vaccinationData.vaccine,
        description: `Vacunación: ${vaccinationData.vaccine} para ${vaccinationData.animal}`,
      };

      const newRecord = await healthService.createRecord(payload);

      alertService.success(
        `Vacunación programada correctamente para ${vaccinationData.animal}`,
        "Éxito",
      );

      // Actualizar estado local inmediatamente para evitar saltos
      setVaccinations((prev) => [...prev, { ...newRecord, ...payload }]);
      return true;
    } catch (err) {
      console.error("Error scheduling vaccination:", err);
      alertService.error("Error al programar la vacunación", "Error");
      return false;
    } finally {
      setLoading(false);
    }
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
