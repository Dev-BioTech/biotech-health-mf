import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Syringe,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Pencil,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVaccination } from "../hooks/useVaccination";
import { VaccinationForm } from "./VaccinationForm";

export function VaccinationCalendar({
  onSchedule: onExternalSchedule,
  onBack,
}) {
  const {
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
    updateVaccination,
  } = useVaccination();

  const [showForm, setShowForm] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "agenda"

  const handleEditOpen = (vaccination) => {
    setSelectedVaccination(vaccination);
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedVaccination(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVaccination(null);
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const handleSubmit = async (formData) => {
    if (selectedVaccination) {
      await updateVaccination(selectedVaccination.id, formData);
    } else {
      await scheduleVaccination(formData);
    }
    handleCloseForm();
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getVaccinationsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
    return vaccinations.filter((v) => v.date === dateStr);
  };

  const selectedDayVaccinations = getVaccinationsForDate(selectedDay);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  if (loading && vaccinations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-bold p-4">{error}</div>;
  }

  if (showForm) {
    return (
      <VaccinationForm
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
        initialData={selectedVaccination}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header Hero Section */}
      <motion.div
        className="mb-6 relative overflow-hidden rounded-3xl group shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="relative h-40 sm:h-48 bg-cover bg-center rounded-3xl transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/85 to-blue-900/90 rounded-3xl" />
          <div className="relative h-full flex flex-col justify-center px-6 sm:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                {onBack && (
                  <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white border border-white/20"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Syringe className="w-5 h-5 sm:w-8 sm:h-8 text-blue-300" />
                    <h1 className="text-xl sm:text-3xl font-bold text-white">
                      Calendario
                    </h1>
                  </div>
                  <p className="text-blue-100 text-xs sm:text-lg opacity-90">
                    {upcomingVaccinations.length} vacunas pendientes
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleCreateOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg transition-all font-bold text-xs sm:text-base active:scale-95"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Programar</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-blue-200"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-blue-900">
              Citas
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-blue-600 font-medium">
            {upcomingVaccinations.length} pendientes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-200"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-green-900">Mes</h3>
          </div>
          <p className="text-xs sm:text-sm text-green-600 font-medium">
            {completedThisMonth} aplicadas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-yellow-900">Semana</h3>
          </div>
          <p className="text-sm text-yellow-600 font-medium">3 programadas</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-green-50"
        >
          {/* Mobile View Toggle */}
          <div className="lg:hidden flex border-b border-gray-100 p-2 bg-gray-50/50">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                viewMode === "agenda"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Agenda
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {/* Calendar Header with Navigation */}
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100"
                >
                  <ChevronLeft className="w-5 h-5 text-green-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100"
                >
                  <ChevronRight className="w-5 h-5 text-green-600" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "calendar" ? (
                <motion.div
                  key="calendar-grid"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-7 gap-1 sm:gap-2"
                >
                  {/* Day headers */}
                  {["D", "L", "M", "M", "J", "V", "S"].map((day, idx) => (
                    <div
                      key={idx}
                      className="text-center py-2 text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-tighter"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Empty days */}
                  {emptyDays.map((i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Days */}
                  {days.map((day) => {
                    const dayVaccinations = getVaccinationsForDate(day);
                    const hasVaccination = dayVaccinations.length > 0;
                    const isPending = dayVaccinations.some(
                      (v) => v.status === "pending" || v.status === "Pendiente",
                    );
                    const isSelected = day === selectedDay;
                    const isToday =
                      day === new Date().getDate() &&
                      currentMonth === new Date().getMonth() &&
                      currentYear === new Date().getFullYear();

                    return (
                      <motion.div
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        whileTap={{ scale: 0.9 }}
                        className={`aspect-square relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-green-600 text-white border-green-700 shadow-md ring-4 ring-green-100"
                            : isToday
                              ? "bg-green-50 text-green-600 border-green-400"
                              : hasVaccination
                                ? isPending
                                  ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 shadow-sm"
                                  : "bg-green-50 border-green-100 hover:bg-green-100 shadow-sm"
                                : "bg-white border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSelected ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {day}
                        </span>
                        {hasVaccination && !isSelected && (
                          <div
                            className={`absolute bottom-1 sm:bottom-2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                              isPending ? "bg-yellow-500" : "bg-green-500"
                            }`}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="agenda-list"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 max-h-[400px] overflow-y-auto px-1"
                >
                  {days
                    .filter((d) => getVaccinationsForDate(d).length > 0)
                    .map((day) => (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Día {day}
                          </span>
                          <div className="h-[1px] flex-1 bg-gray-100" />
                        </div>
                        {getVaccinationsForDate(day).map((v, i) => (
                          <div
                            key={i}
                            onClick={() => handleEditOpen(v)}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                v.status === "pending" ||
                                v.status === "Pendiente"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              <Syringe className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {v.animalName || v.animal}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                {v.treatment || v.vaccine}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        ))}
                      </div>
                    ))}
                  {days.filter((d) => getVaccinationsForDate(d).length > 0)
                    .length === 0 && (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">
                        No hay eventos este mes
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Day Agenda (Desktop & Mobile Calendar View) */}
            <AnimatePresence>
              {viewMode === "calendar" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-6 border-t border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-1 h-5 bg-green-500 rounded-full" />
                      Día {selectedDay}
                    </h3>
                    {selectedDayVaccinations.length > 0 && (
                      <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        {selectedDayVaccinations.length}{" "}
                        {selectedDayVaccinations.length === 1
                          ? "evento"
                          : "eventos"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedDayVaccinations.map((vac, idx) => (
                      <motion.div
                        key={idx}
                        layoutId={`vac-${vac.id}`}
                        onClick={() => handleEditOpen(vac)}
                        className="group flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-green-100 hover:shadow-lg hover:shadow-green-50 transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform">
                          <Syringe className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-gray-800 truncate">
                              {vac.animalName || vac.animal}
                            </h4>
                            <span
                              className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${
                                vac.status === "pending" ||
                                vac.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {vac.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {vac.treatment || vac.vaccine}
                          </p>
                        </div>
                        <div className="shrink-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 rounded-xl">
                          <Pencil className="w-3.5 h-3.5" />
                        </div>
                      </motion.div>
                    ))}
                    {selectedDayVaccinations.length === 0 && (
                      <p className="text-center py-6 text-sm text-gray-400 italic">
                        No hay actividades para esta fecha.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Upcoming Vaccinations Sidebar (Desktop Only or Fallback) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:block bg-white rounded-3xl shadow-xl p-6 border-2 border-green-50 self-start"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Próximos Pasos</h2>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Syringe className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-4">
            {upcomingVaccinations.map((vaccination, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                onClick={() => handleEditOpen(vaccination)}
                className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50 cursor-pointer hover:shadow-lg hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="flex items-center justify-between gap-3 relative">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                      <Syringe className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 mb-0.5 truncate uppercase tracking-tight">
                        {vaccination.animalName || vaccination.animal}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-blue-600 font-bold uppercase truncate tracking-widest">
                          {vaccination.treatment || vaccination.vaccine}
                        </p>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <p className="text-[10px] text-gray-400 font-medium">
                          {vaccination.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
            {upcomingVaccinations.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-100 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Todo al día</p>
              </div>
            )}
            <button
              onClick={handleCreateOpen}
              className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Añadir Vacuna
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default VaccinationCalendar;
