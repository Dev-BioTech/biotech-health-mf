import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Search,
  FileText,
  ChevronRight,
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useHealthRecords } from "../hooks/useHealthRecords";

const DiagnosticHistory = ({ onBack }) => {
  const {
    records,
    loading,
    searchTerm,
    setSearchTerm,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    currentPage,
    totalPages,
    paginate,
  } = useHealthRecords();

  const getSeverityColor = (status) => {
    // We simulate severity based on status or type
    if (
      status === "En Curso" ||
      status === "Emergencia" ||
      status === "Pendiente"
    )
      return "text-red-600 bg-red-50 border-red-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            backgroundImage: `url('https://images.unsplash.com/photo-1579152276503-31581d9f8df2?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/85 to-violet-900/90 rounded-3xl" />
          <div className="relative h-full flex flex-col justify-center px-4 sm:px-8">
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
              <div className="text-white">
                <div className="flex items-center gap-3 mb-1">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Historial de Diagnósticos
                  </h1>
                </div>
                <p className="text-blue-100 text-sm sm:text-lg opacity-90">
                  Seguimiento clínico y tratamientos por animal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-green-50 w-full sm:w-auto overflow-hidden">
          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="text-xs sm:text-sm focus:outline-none bg-transparent min-w-0"
          />
          <span className="text-gray-300 font-bold">-</span>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="text-xs sm:text-sm focus:outline-none bg-transparent min-w-0"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {records.map((record, idx) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getSeverityColor(
                      record.status,
                    )}`}
                  >
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {record.animalName}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      ID: {record.animalId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(
                      record.status,
                    )}`}
                  >
                    {record.status}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {record.date}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Diagnóstico
                  </p>
                  <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {record.diagnosis || "Sin diagnóstico registrado"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Tratamiento
                  </p>
                  <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {record.treatment || "Sin tratamiento registrado"}
                  </p>
                </div>
              </div>

              <div className="mt-4 pl-16 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Atendido por: {record.veterinarian}
                </div>

                {record.nextVisit && (
                  <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    Próxima revisión: {record.nextVisit}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No se encontraron diagnósticos que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100"
                  : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-500 hover:shadow-md"
              }`}
            >
              Anterior
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-sm font-bold text-blue-900">Página</span>
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">
                {currentPage}
              </span>
              <span className="text-sm font-bold text-blue-900">
                de {totalPages}
              </span>
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100"
                  : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-500 hover:shadow-md"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticHistory;
