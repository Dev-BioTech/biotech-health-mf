import { useState, useEffect } from "react";
import {
  Save,
  AlertCircle,
  Stethoscope,
  ClipboardList,
  User,
  Activity,
  FileText,
  Clock,
  Info,
  Syringe,
} from "lucide-react";
import { motion } from "framer-motion";
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

  const validate = () => {
    const newErrors = {};
    if (!formData.animalId)
      newErrors.animalId = "El ID del animal es requerido";
    if (!formData.animalName.trim())
      newErrors.animalName = "El nombre del animal es requerido";
    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.diagnosis.trim())
      newErrors.diagnosis = "El diagnóstico es requerido";

    // Backend rule: EventDate cannot be in the FUTURE
    if (new Date(formData.date) > new Date()) {
      newErrors.date = "La fecha no puede ser en el futuro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        // Ensure correct numeric types
        animalId: formData.animalId ? Number(formData.animalId) : null,
        batchId: formData.batchId ? Number(formData.batchId) : null,
        farmId: formData.farmId
          ? Number(formData.farmId)
          : Number(authUtils.getSelectedFarmId()),
      };
      // Backend requires EXACTLY one of animalId or batchId (XOR)
      // If both are null, we can't proceed
      if (!payload.animalId && !payload.batchId) {
        setErrors((prev) => ({
          ...prev,
          animalId: "Debes ingresar el ID del animal",
        }));
        setIsSubmitting(false);
        return;
      }
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

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm text-sm";
  const labelStyles =
    "flex flex-col gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";
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
            backgroundImage: `url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-green-900/90" />
          <div className="relative h-full flex flex-col justify-center px-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-300/20 rounded-2xl backdrop-blur-sm">
                <ClipboardList className="w-7 h-7 text-green-300" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {isEditing ? "Editar Registro Médico" : "Nuevo Registro Clínico"}
                </h2>
                <p className="text-green-100/70 text-xs md:text-sm font-medium">
                  Documentación detallada del estado de salud y procedimientos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10 md:space-y-12">
        {!formData.farmId && (
          <div className="p-4 bg-yellow-50/80 border border-yellow-200 text-yellow-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
            <Info className="w-5 h-5" />
            No se ha detectado una granja seleccionada.
          </div>
        )}

        {/* SECTION 1: IDENTIFICACIÓN */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>IDENTIFICACIÓN DEL PACIENTE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelStyles}>
                ID Animal
                <span className="text-[9px] text-gray-300 tracking-normal">
                  (NUMÉRICO)
                </span>
              </label>
              <input
                type="number"
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                placeholder="Ej. 101"
                className={`${inputStyles} ${errors.animalId ? "border-red-200" : ""}`}
              />
              {errors.animalId && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.animalId}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles}>Nombre Animal</label>
              <input
                type="text"
                name="animalName"
                value={formData.animalName}
                onChange={handleChange}
                placeholder="Ej. Vaca Luna"
                className={`${inputStyles} ${errors.animalName ? "border-red-200" : ""}`}
              />
              {errors.animalName && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.animalName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CATEGORIZACIÓN */}
        <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-10 border border-gray-100/50 space-y-8 shadow-inner">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>CATEGORIZACIÓN Y ESTADO</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelStyles}>Tipo de Registro</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Chequeo">CHEQUEO GENERAL</option>
                <option value="Vacunación">VACUNACIÓN</option>
                <option value="Tratamiento">TRATAMIENTO ESPECÍFICO</option>
                <option value="Desparasitación">DESPARASITACIÓN</option>
                <option value="Emergencia">EMERGENCIA / URGENCIAS</option>
              </select>
            </div>

            <div>
              <label className={labelStyles}>Estado del Procedimiento</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputStyles} ${errors.status ? "border-red-200" : ""}`}
              >
                <option value="Pendiente">PENDIENTE</option>
                <option value="En Curso">EN CURSO</option>
                <option value="Completado">COMPLETADO</option>
                <option value="Cancelado">CANCELADO</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-[9px] font-bold tracking-wide mt-2 px-1 leading-tight uppercase">
                  {errors.status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: DATOS CLÍNICOS */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>INFORMACIÓN CLÍNICA</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelStyles}>Fecha del Evento</label>
              <input
                type="date"
                name="date"
                value={formData.date}
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
              <label className={labelStyles}>Especialista / Veterinario</label>
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

          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className={labelStyles}>Diagnóstico Final / Hallazgos</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Descripción diagnóstica breve..."
                className={`${inputStyles} ${errors.diagnosis ? "border-red-200" : ""}`}
              />
              {errors.diagnosis && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wide mt-2 px-1">
                  {errors.diagnosis}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelStyles}>Descripción Detallada</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detalles clínicos adicionales observados..."
                  className={`${inputStyles} resize-none min-h-[120px]`}
                />
              </div>

              <div>
                <label className={labelStyles}>Protocolo de Tratamiento</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Medicamentos, dosis o acciones a seguir..."
                  className={`${inputStyles} resize-none min-h-[120px]`}
                />
              </div>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="p-5 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <AlertCircle className="w-6 h-6" />
            {errors.submit}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-100/50">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-10 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all text-center"
          >
            DESCARTAR CAMBIOS
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-5 px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 md:w-6 md:h-6 text-green-300" />
                {isEditing ? "ACTUALIZAR REGISTRO" : "CONFIRMAR REGISTRO"}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
