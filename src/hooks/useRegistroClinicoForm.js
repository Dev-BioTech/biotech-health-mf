import { useState, useEffect } from "react";
import { authUtils } from "@shared/utils/auth";
import { animalService } from "../shared/services/animalService";

export const useRegistroClinicoForm = (initialData = null, onSubmit) => {
  const [formData, setFormData] = useState({
    farmId: authUtils.getSelectedFarmId() || "",
    animalId: "",
    animalName: "",
    type: "Chequeo",
    date: new Date().toISOString().split("T")[0],
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    status: "Pendiente",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingAnimal, setIsSearchingAnimal] = useState(false);

  useEffect(() => {
    if (initialData) {
      const normalizedDate = initialData.date
        ? initialData.date.split("T")[0]
        : "";

      setFormData({
        ...initialData,
        date: normalizedDate,
        farmId: initialData.farmId || authUtils.getSelectedFarmId(),
      });
    }
  }, [initialData]);

  // Real search logic for animals with debouncing
  useEffect(() => {
    const searchAnimal = async () => {
      // Don't search if editing or if ID is empty
      if (!formData.animalId || initialData) return;

      setIsSearchingAnimal(true);
      try {
        const animal = await animalService.getAnimalById(formData.animalId);
        if (animal) {
          setFormData((prev) => ({
            ...prev,
            animalName: animal.name || animal.identifier || `Animal ${animal.id}`,
          }));
          setErrors((prev) => ({ ...prev, animalId: null }));
        } else {
          setFormData((prev) => ({ ...prev, animalName: "" }));
          setErrors((prev) => ({ ...prev, animalId: "Animal no encontrado" }));
        }
      } catch (error) {
        console.error("Error searching animal:", error);
        setFormData((prev) => ({ ...prev, animalName: "" }));
        setErrors((prev) => ({ ...prev, animalId: "Error al buscar animal" }));
      } finally {
        setIsSearchingAnimal(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (formData.animalId.length >= 1) {
        searchAnimal();
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(debounceTimer);
  }, [formData.animalId, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.animalId)
      newErrors.animalId = "El ID del animal es requerido";
    if (!formData.animalName?.trim())
      newErrors.animalName = "El nombre del animal es requerido";
    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.diagnosis?.trim())
      newErrors.diagnosis = "El diagnóstico es requerido";

    if (formData.date && new Date(formData.date) > new Date()) {
      newErrors.date = "La fecha no puede ser en el futuro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        animalId: formData.animalId ? Number(formData.animalId) : null,
        farmId: formData.farmId ? Number(formData.farmId) : null,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Error al procesar los datos del formulario",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSearchingAnimal,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors
  };
};
