import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export function VaccinationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    animal: "", // Should be an animal selector, but using text for now
    vaccine: "",
    date: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.animal.trim()) newErrors.animal = "El animal es requerido";
    if (!formData.vaccine.trim()) newErrors.vaccine = "La vacuna es requerida";
    if (!formData.date) newErrors.date = "La fecha es requerida";

    if (new Date(formData.date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "No puedes programar vacunas en fechas pasadas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Animal / Lote
        </label>
        <input
          type="text"
          name="animal"
          value={formData.animal}
          onChange={handleChange}
          placeholder="ej. BOV-001 o Lote A"
          className={`w-full px-4 py-2 rounded-xl border ${
            errors.animal ? "border-red-500 bg-red-50" : "border-gray-200"
          } focus:ring-2 focus:ring-green-500 outline-none`}
        />
        {errors.animal && (
          <p className="text-red-500 text-xs mt-1">{errors.animal}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vacuna / Tratamiento
        </label>
        <input
          type="text"
          name="vaccine"
          value={formData.vaccine}
          onChange={handleChange}
          placeholder="ej. Aftosa"
          className={`w-full px-4 py-2 rounded-xl border ${
            errors.vaccine ? "border-red-500 bg-red-50" : "border-gray-200"
          } focus:ring-2 focus:ring-green-500 outline-none`}
        />
        {errors.vaccine && (
          <p className="text-red-500 text-xs mt-1">{errors.vaccine}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Programada
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
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
            Prioridad
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

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
            "Guardando..."
          ) : (
            <>
              <Save className="w-4 h-4" />
              Programar
            </>
          )}
        </button>
      </div>
    </form>
  );
}
