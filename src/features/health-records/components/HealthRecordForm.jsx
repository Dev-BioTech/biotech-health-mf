import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";

export function HealthRecordForm({ onSubmit, onCancel, initialData = null }) {
  // Try to get farmId from localStorage (auth-storage), similar to other components
  const getFarmId = () => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed?.state?.selectedFarm?.id;
      } catch (e) {
        console.error("Error parsing auth storage", e);
      }
    }
    return "";
  };

  const [formData, setFormData] = useState({
    farmId: getFarmId(),
    animalId: "", 
    animalName: "",
    type: "Chequeo",
    date: new Date().toISOString().split("T")[0],
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    status: "Completado",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.animalId)
      newErrors.animalId = "El ID del animal es requerido";
    if (!formData.animalName.trim()) newErrors.animalName = "El nombre es requerido";

    if (!formData.date) newErrors.date = "La fecha es requerida";
    // Optional fields depending on strictness
    if (!formData.diagnosis.trim())
      newErrors.diagnosis = "El diagnóstico es requerido";

    if (
      new Date(formData.date) > new Date() &&
      formData.status === "Completado"
    ) {
      newErrors.date =
        "Una fecha futura no puede estar marcada como completada";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Format payload for backend
      const payload = {
        ...formData,
        animalId: Number(formData.animalId), // Ensure numeric
        farmId: Number(formData.farmId), // Ensure numeric
        // Add other conversions if needed
      };
      await onSubmit(payload);
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Animal (Numérico)
          </label>
          <input
            type="number"
            name="animalId"
            value={formData.animalId}
            onChange={handleChange}
            placeholder="Ej. 101"
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.animalId ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none transition-all`}
          />
          {errors.animalId && (
            <p className="text-red-500 text-xs mt-1">{errors.animalId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Animal (Referencia)
          </label>
          <input
            type="text"
            name="animalName"
            value={formData.animalName}
            onChange={handleChange}
            placeholder="Opcional"
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.animalName ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none transition-all`}
          />
        </div>
      </div>

      {/* Rest of the form remains similar but ensuring safe handling */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Registro
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Chequeo">Chequeo</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Desparasitación">Desparasitación</option>
            <option value="Emergencia">Emergencia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Completado">Completado</option>
            <option value="En Curso">En Curso</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.date ? "border-red-500 bg-red-50" : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Veterinario
          </label>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.veterinarian
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            } focus:ring-2 focus:ring-green-500 outline-none`}
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
