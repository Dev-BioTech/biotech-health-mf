import {
  Save,
  AlertCircle,
  Stethoscope,
  Activity,
  FileText,
  Info,
  ClipboardList,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { useRegistroClinicoForm } from "../../../hooks/useRegistroClinicoForm";
import { HEALTH_RECORD_TYPES, PROCEDURE_STATUSES } from "../../../shared/constants/healthConstants";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";

export function HealthRecordForm({ onSubmit, onCancel, initialData = null }) {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isSubmitting,
    isSearchingAnimal,
    handleChange,
    handleSubmit,
  } = useRegistroClinicoForm(initialData, onSubmit);

  const isEditing = Boolean(initialData);

  // Premium styles from AnimalFormView
  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm";
  const selectStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 shadow-sm appearance-none cursor-pointer bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_1rem_center]";
  const labelStyles =
    "flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";
  const sectionTitleStyles =
    "text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full my-4 md:my-6 bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mx-auto max-w-5xl"
    >
      {/* Header Area */}
      <div className="relative overflow-hidden group shadow-lg">
        <div
          className="relative min-h-[160px] md:h-44 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-[#1a5a35]/85 to-green-900/90" />
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12 py-6 md:py-0 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-green-300/20 rounded-xl backdrop-blur-md">
                    <ClipboardList className="w-7 h-7 text-green-300" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                    {isEditing ? "EDITAR REGISTRO CLÍNICO" : "NUEVO REGISTRO CLÍNICO"}
                  </h2>
                </div>
                <p className="text-green-100/80 text-sm md:text-lg max-w-xl font-medium">
                  Documentación detallada del estado de salud y procedimientos médicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 lg:p-14 space-y-12"
      >
        {!formData.farmId && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm mb-4">
            <Info className="w-5 h-5 text-yellow-600" />
            No se ha detectado una granja seleccionada.
          </div>
        )}

        {/* SECTION 1: IDENTIFICACIÓN */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>IDENTIFICACIÓN DEL PACIENTE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="flex flex-col">
              <div className="h-[42px] flex flex-col justify-end">
                <label className={labelStyles}>
                  ID Animal
                  <span className="text-[9px] text-gray-400 font-normal lowercase italic ml-2">
                    (numérico) / búsqueda por granja
                  </span>
                </label>
              </div>
              <input
                type="number"
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                placeholder="Ej. 101"
                className={cn(inputStyles, errors.animalId ? "border-red-400 ring-2 ring-red-100" : "")}
              />
              {errors.animalId && (
                <p className="mt-2 text-red-600 text-[10px] font-bold uppercase tracking-wide">
                  {errors.animalId}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="h-[42px] flex flex-col justify-end">
                <label className={labelStyles}>Nombre Animal</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="animalName"
                  value={formData.animalName}
                  onChange={handleChange}
                  placeholder="Ej. Vaca Luna"
                  className={cn(
                    inputStyles,
                    errors.animalName ? "border-red-400 ring-2 ring-red-100" : "",
                    isSearchingAnimal ? "text-transparent select-none" : ""
                  )}
                  readOnly={isSearchingAnimal}
                />
                {isSearchingAnimal && (
                  <div className="absolute inset-0 rounded-2xl animate-shimmer bg-[#F5F5F5]" />
                )}
              </div>
              {errors.animalName && (
                <p className="mt-2 text-red-600 text-[10px] font-bold uppercase tracking-wide">
                  {errors.animalName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CATEGORIZACIÓN */}
        <div className="bg-gray-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 border border-gray-100/50 space-y-10">
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
                className={selectStyles}
              >
                {HEALTH_RECORD_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyles}>Estado del Procedimiento</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={cn(selectStyles, errors.status ? "border-red-400 ring-2 ring-red-100" : "")}
              >
                {PROCEDURE_STATUSES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-2 text-red-600 text-[10px] font-bold uppercase tracking-wide px-1">
                  {errors.status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: DATOS CLÍNICOS */}
        <div className="space-y-10">
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
                className={cn(inputStyles, errors.date ? "border-red-400 ring-2 ring-red-100" : "")}
              />
              {errors.date && (
                <p className="mt-2 text-red-600 text-[10px] font-bold uppercase tracking-wide">
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

          <div className="space-y-8">
            <div>
              <label className={labelStyles}>Diagnóstico Final / Hallazgos</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Descripción diagnóstica breve..."
                className={cn(inputStyles, errors.diagnosis ? "border-red-400 ring-2 ring-red-100" : "")}
              />
              {errors.diagnosis && (
                <p className="mt-2 text-red-600 text-[10px] font-bold uppercase tracking-wide">
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
                  placeholder="Detalles clínicos adicionales observados..."
                  className={cn(inputStyles, "min-h-[140px] resize-none")}
                />
              </div>

              <div>
                <label className={labelStyles}>Protocolo de Tratamiento</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Medicamentos, dosis o acciones a seguir..."
                  className={cn(inputStyles, "min-h-[140px] resize-none")}
                />
              </div>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="p-5 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <AlertCircle className="w-6 h-6" />
            {errors.submit}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            DESCARTAR CAMBIOS
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 md:px-14 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5 md:w-6 md:h-6 text-green-300" />
            )}
            {isSubmitting
              ? "PROCESANDO..."
              : isEditing
                ? "ACTUALIZAR REGISTRO"
                : "CONFIRMAR REGISTRO"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
