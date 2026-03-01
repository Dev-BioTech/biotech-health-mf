import { useState } from "react";
import {
  VACCINE_TYPES,
  HEALTH_STATUS,
} from "@shared/constants/healthConstants";

export default function VaccinationSchedule() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const vaccinations = [
    {
      id: 1,
      animal: "Vaca #001",
      vaccine: "Rabia",
      date: "2024-12-15",
      status: "Pendiente",
    },
    {
      id: 2,
      animal: "Vaca #002",
      vaccine: "Brucelosis",
      date: "2024-12-18",
      status: "Completado",
    },
    {
      id: 3,
      animal: "Vaca #003",
      vaccine: "Tuberculosis",
      date: "2024-12-20",
      status: "Pendiente",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Calendar of Vaccination
        </h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          + New Vaccination
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {[
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
            ].map((month, idx) => (
              <option key={idx} value={idx}>
                {month}
              </option>
            ))}
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">Todas las vacunas</option>
            {Object.entries(VACCINE_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Próximas Vacunaciones
        </h2>

        <div className="space-y-3">
          {vaccinations.map((vaccination) => (
            <div
              key={vaccination.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">💉</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {vaccination.animal}
                  </p>
                  <p className="text-sm text-gray-600">{vaccination.vaccine}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(vaccination.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(vaccination.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                    })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    vaccination.status === "Completado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {vaccination.status}
                </span>

                <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">
                  Aplicar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vaccination statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Vacunaciones Este Mes
          </h3>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Cobertura de Vacunación
          </h3>
          <p className="text-3xl font-bold text-gray-900">95%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Vacunas Pendientes
          </h3>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-orange-600 mt-1">Requieren atención</p>
        </div>
      </div>
    </div>
  );
}
