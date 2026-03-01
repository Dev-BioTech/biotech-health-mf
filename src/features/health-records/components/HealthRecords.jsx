import { useHealthRecords } from "../hooks/useHealthRecords";
import { HEALTH_STATUS } from "@shared/constants/healthConstants";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthRecords({ onBack }) {
  const { records, loading, error } = useHealthRecords();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            Registros de Salud
          </h1>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          + Nuevo Registro
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Saludables</p>
              <p className="text-3xl font-bold text-green-700">85</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">
                En Tratamiento
              </p>
              <p className="text-3xl font-bold text-yellow-700">12</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Críticos</p>
              <p className="text-3xl font-bold text-red-700">3</p>
            </div>
            <span className="text-4xl">🚨</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Vacunaciones Pendientes
              </p>
              <p className="text-3xl font-bold text-blue-700">8</p>
            </div>
            <span className="text-4xl">💉</span>
          </div>
        </div>
      </div>

      {/* Record table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Diagnóstico
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Veterinario
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-lg">🐄</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {record.animalName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.animalId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(record.date).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.diagnosis}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        record.status === "Saludable"
                          ? "bg-green-100 text-green-800"
                          : record.status === "En Recuperación"
                            ? "bg-yellow-100 text-yellow-800"
                            : record.status === "Enfermo"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.veterinarian}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
