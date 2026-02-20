import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Syringe,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVaccination } from "../hooks/useVaccination";
import { Modal } from "@shared/components/Modal";
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
  } = useVaccination();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSchedule = async (formData) => {
    await scheduleVaccination(formData);
    setIsModalOpen(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header Hero Section */}
      <motion.div
        className="mb-8 relative overflow-hidden rounded-3xl group shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="relative h-48 bg-cover bg-center rounded-3xl transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/85 to-blue-900/90 rounded-3xl" />
          <div className="relative h-full flex flex-col justify-center px-4 sm:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                {onBack && (
                  <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white border border-white/20"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </motion.button>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Syringe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      Calendario de Vacunación
                    </h1>
                  </div>
                  <p className="text-blue-100 text-sm sm:text-lg opacity-90">
                    {upcomingVaccinations.length} vacunas pendientes.
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg transition-all font-bold text-sm sm:text-base active:scale-95"
              >
                <Syringe className="w-5 h-5" />
                <span>Programar Vacuna</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-2 border-blue-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Programadas</h3>
          </div>
          <p className="text-sm text-blue-600">
            {upcomingVaccinations.length} vacunaciones
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-2 border-green-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-900">Completadas</h3>
          </div>
          <p className="text-sm text-green-600">
            {completedThisMonth} este mes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-yellow-900">Esta Semana</h3>
          </div>
          <p className="text-sm text-yellow-600">3 vacunaciones</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-green-100 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-green-100 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[400px] sm:min-w-0 grid grid-cols-7 gap-1 sm:gap-2">
              {/* Day headers */}
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-sm font-semibold text-green-600"
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
                  (v) => v.status === "pending",
                );
                const isToday =
                  day === new Date().getDate() &&
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear();

                return (
                  <motion.div
                    key={day}
                    whileHover={hasVaccination ? { scale: 1.05 } : {}}
                    className={`aspect-square p-2 rounded-xl border-2 transition-all cursor-pointer ${
                      isToday
                        ? "bg-green-600 text-white border-green-700"
                        : hasVaccination
                          ? isPending
                            ? "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
                            : "bg-green-100 border-green-300 hover:bg-green-200"
                          : "bg-white border-green-100 hover:bg-green-50"
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <span
                        className={`text-center text-sm font-semibold ${
                          isToday ? "text-white" : "text-green-900"
                        }`}
                      >
                        {day}
                      </span>
                      {hasVaccination && (
                        <div className="flex-1 flex items-center justify-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isPending ? "bg-yellow-500" : "bg-green-500"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t-2 border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded" />
              <span className="text-xs text-green-600">Hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded" />
              <span className="text-xs text-green-600">Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded" />
              <span className="text-xs text-green-600">Completada</span>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Vaccinations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100"
        >
          <h2 className="text-lg font-bold text-green-900 mb-6">
            Próximas Vacunaciones
          </h2>
          <div className="space-y-4">
            {upcomingVaccinations.map((vaccination, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Syringe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-900 mb-1">
                      {vaccination.animal}
                    </p>
                    <p className="text-xs text-green-600 mb-2">
                      {vaccination.vaccine}
                    </p>
                    <p className="text-xs text-yellow-600">
                      {vaccination.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {upcomingVaccinations.length === 0 && (
              <p className="text-gray-500 text-center">
                No hay vacunas pendientes.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Programar Vacunación"
      >
        <VaccinationForm
          onSubmit={handleSchedule}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default VaccinationCalendar;
