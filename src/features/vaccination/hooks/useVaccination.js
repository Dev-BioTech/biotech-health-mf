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
        farmId: Number(farmId),
        animalId: vaccinationData.animalId ? Number(vaccinationData.animalId) : null,
        batchId: null, // Using animalId, not batchId
        type: "Vacunación",
        eventType: "Vacunación",
        date: vaccinationData.date,
        animalName: vaccinationData.animal,
        diagnosis: "Vacunación Aplicada",
        treatment: vaccinationData.vaccine,
        description: `Vacunación: ${vaccinationData.vaccine} para ${vaccinationData.animal}`,
        veterinarian: vaccinationData.veterinarian,
        status: vaccinationData.status || "Completado",
        requiresFollowUp: false,
      };

      if (!payload.animalId) {
        alertService.error("El ID del animal es requerido", "Error");
        return false;
      }

      const newRecord = await healthService.createRecord(payload);

      alertService.success(
        `Vacunación registrada correctamente para ${vaccinationData.animal}`,
        "Éxito",
      );

      setVaccinations((prev) => [...prev, { ...newRecord, ...payload }]);
      return true;
    } catch (err) {
      console.error("Error registering vaccination:", err);
      alertService.error("Error al registrar la vacunación", "Error");
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
    .filter((v) => v.status === "pending" || v.status === "Pending")
    .slice(0, 5);

  const completedThisMonth = vaccinations.filter(
    (v) => v.status === "completed" || v.status === "Completed",
  ).length;

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
    updateVaccination: async (id, vaccinationData) => {
      try {
        setLoading(true);
        const payload = {
          ...vaccinationData,
          animalName: vaccinationData.animal,
          treatment: vaccinationData.vaccine,
          description: `Vacunación: ${vaccinationData.vaccine} para ${vaccinationData.animal}`,
        };

        const updatedRecord = await healthService.updateRecord(id, payload);

        alertService.success(
          `Vacunación para ${vaccinationData.animal} actualizada correctamente`,
          "Éxito",
        );

        setVaccinations((prev) =>
          prev.map((v) =>
            v.id === id ? { ...v, ...updatedRecord, ...payload } : v,
          ),
        );
        return true;
      } catch (err) {
        console.error("Error updating vaccination:", err);
        alertService.error("Error al actualizar la vacunación", "Error");
        return false;
      } finally {
        setLoading(false);
      }
    },
  };
};
