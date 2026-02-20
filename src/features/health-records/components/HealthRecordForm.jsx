import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import { authUtils } from "@shared/utils/auth";

export function HealthRecordForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    farmId: authUtils.getSelectedFarmId(),
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

  useEffect(() => {
    if (initialData) {
      // Normalizar fecha para el input type="date" (YYYY-MM-DD)
      const normalizedDate = initialData.date
        ? initialData.date.split("T")[0]
        : "";

      setFormData({
        ...initialData,
        date: normalizedDate,
        // Asegurar que farmId persista si viene en initialData o usar el actual
        farmId: initialData.farmId || authUtils.getSelectedFarmId(),
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.animalId)
      newErrors.animalId = "El ID del animal es requerido";
    if (!formData.animalName.trim())
      newErrors.animalName = "El nombre del animal es requerido";

    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.diagnosis.trim())
      newErrors.diagnosis = "El diagnóstico es requerido";

    if (new Date(formData.date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "No puedes registrar eventos en fechas pasadas";
    }

    if (
      new Date(formData.date) > new Date() &&
      formData.status === "Completado"
    ) {
      newErrors.status =
        "Para citas futuras, por favor usa 'Pendiente'. Podrás marcarla como 'Completada' el día del registro.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Preparar payload asegurando tipos de datos correctos
      const payload = {
        ...formData,
        animalId: formData.animalId ? Number(formData.animalId) : null,
        farmId: formData.farmId
          ? Number(formData.farmId)
          : Number(authUtils.getSelectedFarmId()),
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
    // Clear error when writing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden Farm ID check */}
      {!formData.farmId && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4">
          ⚠️ No se ha detectado una granja seleccionada. Es posible que el
          registro falle.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            ID Animal{" "}
            <span className="text-[10px] text-gray-400 font-normal">
              (Numérico)
            </span>
          </label>
          <input
            type="number"
            name="animalId"
            value={formData.animalId}
            onChange={handleChange}
            placeholder="Ej. 101"
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.animalId ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm`}
          />
          {errors.animalId && (
            <p className="text-red-500 text-[10px] mt-1">{errors.animalId}</p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Nombre Animal
          </label>
          <input
            type="text"
            name="animalName"
            value={formData.animalName}
            onChange={handleChange}
            placeholder="Ej. Vaca Luna"
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.animalName ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm`}
          />
        </div>
      </div>

      {/* Rest of the form remains similar but ensuring safe handling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Tipo de Registro
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
          >
            <option value="Chequeo">Chequeo</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Desparasitación">Desparasitación</option>
            <option value="Emergencia">Emergencia</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.status ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none text-sm`}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Curso">En Curso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-[10px] mt-1 leading-tight">
              {errors.status}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.date ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none text-sm`}
          />
          {errors.date && (
            <p className="text-red-500 text-[10px] mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Veterinario
          </label>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            placeholder="Nombre del profesional"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diagnóstico
        </label>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-xl border ${
            errors.diagnosis ? "border-red-500 bg-red-50" : "border-gray-200"
          } focus:ring-2 focus:ring-green-500 outline-none`}
        />
        {errors.diagnosis && (
          <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción / Notas
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tratamiento Generado
        </label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          rows="2"
          placeholder="Medicamentos o acciones a seguir..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
        />
      </div>

      {errors.submit && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errors.submit}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Registro
            </>
          )}
        </button>
      </div>
    </form>
  );
}
