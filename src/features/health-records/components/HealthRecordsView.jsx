import { useState } from "react";
import {
  Search,
  Plus,
  Heart,
  Calendar,
  User,
  FileText,
  Filter,
  ArrowLeft,
  Pencil,
  Trash2,
  Stethoscope,
  Activity,
  ClipboardList,
  CheckCircle2,
  AlertCircle as AlertIcon,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthRecords } from "../hooks/useHealthRecords";
import { Modal } from "@shared/components/Modal";
import { HealthRecordForm } from "./HealthRecordForm";
import alertService from "@shared/utils/alertService";

export function HealthRecordsView({
  onCreate: onExternalCreate,
  onEdit,
  onBack,
}) {
  const {
    records,
    allRecords,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    createRecord,
    updateRecord,
    currentPage,
    totalPages,
    paginate,
  } = useHealthRecords();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEditOpen = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmit = async (formData) => {
    try {
      let success;
      if (selectedRecord) {
        success = await updateRecord(selectedRecord.id, formData);
      } else {
        success = await createRecord(formData);
      }

      if (success) {
        alertService.success(
          `Registro de "${formData.animalName}" ${
            selectedRecord ? "actualizado" : "creado"
          } correctamente`,
          "Éxito",
        );
        closeModal();
      } else {
        alertService.error(
          `No se pudo ${selectedRecord ? "actualizar" : "crear"} el registro. Verifica los datos.`,
          "Error",
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      alertService.error(
        "Ocurrió un error inesperado al procesar el registro",
        "Error Crítico",
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-700 border-green-200";
      case "En Curso":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Pendiente":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const renderTypeIcon = (type) => {
    switch (type) {
      case "Vacunación":
        return <Heart className="w-6 h-6 text-white" />;
      case "Chequeo":
        return <FileText className="w-6 h-6 text-white" />;
      case "Tratamiento":
        return <Heart className="w-6 h-6 text-white" />;
      case "Desparasitación":
        return <Heart className="w-6 h-6 text-white" />;
      default:
        return <Heart className="w-6 h-6 text-white" />;
    }
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 font-bold">{error}</div>;
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
            backgroundImage: `url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-green-900/90 rounded-3xl" />
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
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-1">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-300" />
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Registros Médicos
                    </h1>
                  </div>
                  <p className="text-green-100 text-sm sm:text-lg opacity-90">
                    Total: {allRecords.length} expedientes clínicos.
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-green-900 hover:bg-green-50 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg transition-all font-bold text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Registro</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-green-100"
      >
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por animal..."
              className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-green-600 flex-shrink-0" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="Vacunación">Vacunación</option>
                <option value="Chequeo">Chequeo</option>
                <option value="Tratamiento">Tratamiento</option>
                <option value="Desparasitación">Desparasitación</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border-2 border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <span className="hidden sm:block text-gray-400 font-medium">
                al
              </span>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border-2 border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Records List */}
      <div className="grid grid-cols-1 gap-4">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:shadow-xl transition-all group/card"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {renderTypeIcon(record.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-green-900 truncate pr-14">
                      {record.animalName || record.animal}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 uppercase tracking-wider">
                        {record.type}
                      </span>
                      <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        record.statusStyle || record.status,
                      )}`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-green-700 line-clamp-2 mb-4 italic opacity-85">
                  "{record.description || "Sin descripción detallada"}"
                </p>

                <div className="flex items-end justify-between gap-4 bg-green-50/30 p-3 rounded-xl border border-green-100/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-3.5 h-3.5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        {record.veterinarian || "Dr. No asignado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-green-600" />
                      <span>{record.date}</span>
                    </div>
                  </div>

                  {/* Edit button at the bottom right */}
                  {record.status !== "Completado" &&
                    record.status !== "Cancelado" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(record);
                        }}
                        className="p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md border border-blue-100 group/btn hover:scale-105 active:scale-95"
                        title="Editar registro"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-600 border-2 border-green-100 hover:border-green-500 shadow-sm"
            }`}
          >
            Anterior
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Página</span>
            <span className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold shadow-md shadow-green-200">
              {currentPage}
            </span>
            <span className="text-sm font-medium text-gray-500">
              de {totalPages}
            </span>
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-600 border-2 border-green-100 hover:border-green-500 shadow-sm"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && records.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron registros
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedRecord ? "Editar Registro Médico" : "Nuevo Registro Médico"
        }
      >
        <HealthRecordForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          initialData={selectedRecord}
        />
      </Modal>
    </div>
  );
}

// IMPORTANTE: Exportación por defecto necesaria para React.lazy
export default HealthRecordsView;
