import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export function VaccinationForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    animal: initialData?.animal || initialData?.animalName || "",
    vaccine: initialData?.vaccine || initialData?.treatment || "",
    date: initialData?.date
      ? initialData.date.split("T")[0]
      : new Date().toISOString().split("T")[0],
    priority: initialData?.priority || "medium",
    status: initialData?.status || "pending",
    veterinarian: initialData?.veterinarian || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.animal.trim()) newErrors.animal = "El animal es requerido";
    if (!formData.vaccine.trim()) newErrors.vaccine = "La vacuna es requerida";
    if (!formData.date) newErrors.date = "La fecha es requerida";

    if (
      !initialData &&
      new Date(formData.date) < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
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

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm text-sm";
  const labelStyles =
    "flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelStyles}>Animal / Lote</label>
        <input
          type="text"
          name="animal"
          value={formData.animal}
          onChange={handleChange}
          placeholder="Ej: BOV-001 o Lote A"
          className={`${inputStyles} ${errors.animal ? "border-red-200" : ""}`}
        />
        {errors.animal && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
            {errors.animal}
          </p>
        )}
      </div>

      <div>
        <label className={labelStyles}>Vacuna / Tratamiento</label>
        <input
          type="text"
          name="vaccine"
          value={formData.vaccine}
          onChange={handleChange}
          placeholder="Ej: Aftosa"
          className={`${inputStyles} ${errors.vaccine ? "border-red-200" : ""}`}
        />
        {errors.vaccine && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
            {errors.vaccine}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyles}>Fecha Programada</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`${inputStyles} ${errors.date ? "border-red-200" : ""}`}
          />
          {errors.date && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label className={labelStyles}>Prioridad</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="low">BAJA</option>
            <option value="medium">MEDIA</option>
            <option value="high">ALTA</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelStyles}>Veterinario / Responsable</label>
        <input
          type="text"
          name="veterinarian"
          value={formData.veterinarian}
          onChange={handleChange}
          placeholder="Ej: Dr. Salas"
          className={inputStyles}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-50">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/3 px-4 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all text-center"
        >
          DESCARTAR
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl md:rounded-[1.25rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 text-green-300" />
              {initialData ? "CONFIRMAR" : "CONFIRMAR REGISTRO"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
