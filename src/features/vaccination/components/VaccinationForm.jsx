import { useState } from "react";
import {  
  Save,
  AlertCircle,
  Syringe,
  Calendar,
  User,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

export function VaccinationForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    animal: initialData?.animal || initialData?.animalName || "",
    animalId: initialData?.animalId || "",
    vaccine: initialData?.vaccine || initialData?.treatment || "",
    date: initialData?.date
      ? initialData.date.split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: initialData?.status || "Completado",
    veterinarian: initialData?.veterinarian || initialData?.veterinarianName || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.animal.trim()) newErrors.animal = "El animal es requerido";
    if (!formData.animalId) newErrors.animalId = "El ID del animal es requerido";
    if (!formData.vaccine.trim()) newErrors.vaccine = "La vacuna es requerida";
    if (!formData.date) newErrors.date = "La fecha es requerida";

    // Backend rule: EventDate cannot be in the FUTURE
    if (new Date(formData.date) > new Date()) {
      newErrors.date = "La fecha de aplicación no puede ser en el futuro";
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
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm text-sm";
  const labelStyles =
    "flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";
  const sectionTitleStyles =
    "text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]";

  const isEditing = Boolean(initialData);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
    >
      {/* Hero Header Area */}
      <div className="relative overflow-hidden group shadow-lg">
        <div
          className="relative h-32 md:h-44 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/85 to-blue-900/90" />
          <div className="relative h-full flex flex-col justify-center px-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-300/20 rounded-2xl backdrop-blur-sm">
                <Syringe className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {isEditing ? "Actualizar Registro" : "Configuración de Vacunación"}
                </h2>
                <p className="text-blue-100/70 text-xs md:text-sm font-medium">
                   Registre la vacunación aplicada al animal hoy o en una fecha anterior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10 md:space-y-12">
        {errors.date && !formData.date && (
          <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
            <AlertCircle className="w-5 h-5" />
            {errors.date}
          </div>
        )}

        {/* SECTION 1: TRATAMIENTO */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className={sectionTitleStyles}>DETALLES DEL TRATAMIENTO</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div>
              <label className={labelStyles}>Nombre del Animal</label>
              <input
                type="text"
                name="animal"
                value={formData.animal}
                onChange={handleChange}
                placeholder="Ej: Vaca Lola"
                className={`${inputStyles} ${errors.animal ? "border-red-200" : ""}`}
              />
              {errors.animal && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.animal}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles}>ID del Animal</label>
              <input
                type="number"
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                placeholder="Ej: 1042"
                className={`${inputStyles} ${errors.animalId ? "border-red-200" : ""}`}
              />
              {errors.animalId && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.animalId}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles}>Vacuna / Medicamento</label>
              <input
                type="text"
                name="vaccine"
                value={formData.vaccine}
                onChange={handleChange}
                placeholder="Ej: Aftosa o Vitamina B12"
                className={`${inputStyles} ${errors.vaccine ? "border-red-200" : ""}`}
              />
              {errors.vaccine && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.vaccine}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: PROGRAMACIÓN (Indented Sub-box style) */}
        <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-10 border border-gray-100/50 space-y-8 md:space-y-10 shadow-inner">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className={sectionTitleStyles}>CRONOGRAMA Y PRIORIDAD</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            <div>
              <label className={labelStyles}>Fecha de Aplicación</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={`${inputStyles} ${errors.date ? "border-red-200" : ""}`}
              />
              {errors.date && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles}>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Completado">Completado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: RESPONSABLE */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className={sectionTitleStyles}>RESPONSABLE TÉCNICO</h3>
          </div>

          <div className="md:max-w-md">
            <label className={labelStyles}>Veterinario / Aplicador</label>
            <input
              type="text"
              name="veterinarian"
              value={formData.veterinarian}
              onChange={handleChange}
              placeholder="Ej: Dr. Salas"
              className={inputStyles}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-100/50">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-10 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all text-center"
          >
            Anular Cambios
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-5 px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-blue-700 hover:bg-blue-800 text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-blue-900/40 transition-all border border-blue-400/20 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                {isEditing ? "ACTUALIZAR REGISTRO" : "REGISTRAR VACUNACIÓN"}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
