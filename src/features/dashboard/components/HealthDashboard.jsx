import {
  Heart,
  Syringe,
  Activity,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useHealthDashboard } from "../hooks/useHealthDashboard";

export default function HealthDashboard({
  onViewRecords,
  onViewCalendar,
  onViewDiagnostics,
}) {
  const { stats, upcomingEvents, recentTreatments, loading, error } =
    useHealthDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
        Error: {error}
      </div>
    );
  }

  const statsList = [
    {
      label: "Animales Saludables",
      value: stats?.healthy?.value || 0,
      percentage: stats?.healthy?.total
        ? `${Math.round((stats.healthy.value / stats.healthy.total) * 100)}%`
        : "",
      icon: Heart,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      trend: stats?.healthy?.trend || "",
    },
    {
      label: "En Tratamiento",
      value: stats?.treatment?.value || 0,
      percentage: "",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      trend: stats?.treatment?.trend || "",
    },
    {
      label: "Vacunas Pendientes",
      value: stats?.vaccinesPending?.value || 0,
      percentage: "",
      icon: Syringe,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      trend: stats?.vaccinesPending?.trend || "",
    },
    {
      label: "Alertas Críticas",
      value: stats?.critical?.value || 0,
      percentage: "",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      trend: stats?.critical?.trend || "",
    },
  ];

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
            backgroundImage: `url('https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-teal-900/90 rounded-3xl" />
          <div className="relative h-full flex flex-col justify-center px-8">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-green-300" />
              <h1 className="text-3xl font-bold text-white">
                Dashboard de Salud
              </h1>
            </div>
            <p className="text-green-100 text-lg">
              Monitoreo integral y estadísticas de salud de tu ganado.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg p-6 border-2 border-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.percentage && (
                <span className="text-sm font-bold text-green-700">
                  {stat.percentage}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-green-700 mb-2">
              {stat.label}
            </p>
            <p className="text-xs text-green-600">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-900">
              Eventos Próximos
            </h2>
            <button
              onClick={onViewCalendar}
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-all"
            >
              Ver Calendario
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  event.priority === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">
                    {event.date}
                  </span>
                </div>
                <p className="text-sm text-green-700">{event.event}</p>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-gray-500 text-center">
                No hay eventos próximos.
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Treatments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-900">
              Tratamientos Recientes
            </h2>
            <button
              onClick={onViewRecords}
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-all"
            >
              Ver Todos
            </button>
          </div>
          <div className="space-y-4">
            {recentTreatments.map((treatment, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 pb-4 border-b border-green-100 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    treatment.status === "success"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    {treatment.animal}
                  </p>
                  <p className="text-sm text-green-600">
                    {treatment.treatment}
                  </p>
                  <p className="text-xs text-green-500">{treatment.date}</p>
                </div>
              </div>
            ))}
            {recentTreatments.length === 0 && (
              <p className="text-gray-500 text-center">
                No hay tratamientos recientes.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <button
          onClick={onViewRecords}
          className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transition-all text-white text-left group"
        >
          <Heart className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Registros Médicos</h3>
          <p className="text-sm opacity-90">Ver todos los registros de salud</p>
        </button>

        <button
          onClick={onViewCalendar}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all text-white text-left group"
        >
          <Syringe className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Calendario de Vacunación</h3>
          <p className="text-sm opacity-90">Programar y ver vacunas</p>
        </button>

        <button
          onClick={onViewDiagnostics}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all text-white text-left group"
        >
          <Activity className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-1">Historial de Diagnósticos</h3>
          <p className="text-sm opacity-90">Ver y filtrar diagnósticos</p>
        </button>
      </motion.div>
    </div>
  );
}
