import { useState } from "react";
import {
  Search,
  Plus,
  Heart,
  Calendar,
  User,
  FileText,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthRecords } from "../hooks/useHealthRecords";
import { Modal } from "../../../shared/components/Modal";
import { HealthRecordForm } from "./HealthRecordForm";
import alertService from "../../../shared/utils/alertService";

export function HealthRecordsView({ onCreate: onExternalCreate, onEdit }) {
  const {
    records,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    createRecord,
  } = useHealthRecords();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (formData) => {
    try {
      const success = await createRecord(formData);
      if (success) {
        alertService.success(
          `Registro médico de "${formData.animalName}" creado correctamente`,
          "Éxito"
        );
        setIsModalOpen(false);
      } else {
        alertService.error("Error al crear el registro médico", "Error");
      }
    } catch (error) {
      console.error("Error creating record:", error);
      const errorMessage = error.response?.data?.message || error.message;

      if (error.response?.status === 400) {
        alertService.warning(
          "Datos inválidos. Verifica todos los campos",
          "Atención"
        );
      } else if (error.response?.status === 500) {
        alertService.error("Error del servidor. Intenta nuevamente", "Error");
      } else if (!error.response) {
        alertService.error(
          "No se pudo conectar con el servidor",
          "Error de Conexión"
        );
      } else {
        alertService.error(`Error: ${errorMessage}`, "Error");
      }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Registros Médicos
          </h1>
          <p className="text-lg text-green-600">
            Total: {records.length} registros
          </p>
        </motion.div>

        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Registro
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-green-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por animal..."
              className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Chequeo">Chequeo</option>
              <option value="Tratamiento">Tratamiento</option>
              <option value="Desparasitación">Desparasitación</option>
            </select>
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
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => onEdit && onEdit(record.id)}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {renderTypeIcon(record.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-green-900 mb-1">
                      {record.type}
                    </h3>
                    <p className="text-sm text-green-600">
                      {record.animalName} ({record.animalId})
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </div>

                <p className="text-sm text-green-700 mb-3">
                  {record.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">
                      Fecha: {record.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">
                      {record.veterinarian}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">
                      Próxima visita: {record.nextVisit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Registro Médico"
      >
        <HealthRecordForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

// IMPORTANTE: Exportación por defecto necesaria para React.lazy
export default HealthRecordsView;
