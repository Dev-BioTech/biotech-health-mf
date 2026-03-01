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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm text-sm";
  const labelStyles =
    "flex flex-col gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!formData.farmId && (
        <div className="bg-yellow-50/80 border border-yellow-200 text-yellow-800 p-4 rounded-2xl text-xs font-bold tracking-wide uppercase shadow-sm">
          ⚠️ No se ha detectado una granja seleccionada. Es posible que el
          registro falle.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
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
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
              {errors.animalName}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyles}>Tipo de Registro</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="Chequeo">CHEQUEO</option>
            <option value="Vacunación">VACUNACIÓN</option>
            <option value="Tratamiento">TRATAMIENTO</option>
            <option value="Desparasitación">DESPARASITACIÓN</option>
            <option value="Emergencia">EMERGENCIA</option>
          </select>
        </div>

        <div>
          <label className={labelStyles}>Estado</label>
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
            <p className="text-red-500 text-[10px] font-bold tracking-wide mt-1 px-1 leading-tight">
              {errors.status}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyles}>Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={`${inputStyles} ${errors.date ? "border-red-200" : ""}`}
          />
          {errors.date && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label className={labelStyles}>Veterinario</label>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            placeholder="Nombre del profesional"
            className={inputStyles}
          />
        </div>
      </div>

      <div>
        <label className={labelStyles}>Diagnóstico</label>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          placeholder="Descripción clínica breve"
          className={`${inputStyles} ${errors.diagnosis ? "border-red-200" : ""}`}
        />
        {errors.diagnosis && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 px-1">
            {errors.diagnosis}
          </p>
        )}
      </div>

      <div>
        <label className={labelStyles}>Descripción / Notas</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Detalles adicionales..."
          className={`${inputStyles} resize-none`}
        />
      </div>

      <div>
        <label className={labelStyles}>Tratamiento Generado</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          rows="2"
          placeholder="Medicamentos o acciones a seguir..."
          className={`${inputStyles} resize-none`}
        />
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider shadow-sm">
          <AlertCircle className="w-5 h-5" />
          {errors.submit}
        </div>
      )}

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
