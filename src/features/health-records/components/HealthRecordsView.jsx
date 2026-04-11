import { useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  User,
  FileText,
  Filter,
  ArrowLeft,
  Pencil,
  Stethoscope,
  ClipboardList,
  Pill,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthRecords } from "../hooks/useHealthRecords";
import { Modal } from "@shared/components/Modal";
import { HealthRecordForm } from "./HealthRecordForm";
import alertService from "@shared/utils/alertService";
import { getBadgeColorByType } from "@/utils/healthRecordUtils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Inline style constants aligned with DESIGN.md
 * Cards: bg #FFFFFF, border-radius 12px, shadow 0 4px 6px rgba(0,0,0,0.05), padding 20px 24px
 * Hover: shadow 0 8px 16px rgba(0,0,0,0.08), transition all 200ms ease
 * Inputs: bg #F5F5F5, border 1px solid #E0E0E0, focus border #2E7D32 + shadow
 */
const filterInputStyle = {
  backgroundColor: "#F5F5F5",
  border: "1px solid #E0E0E0",
  borderRadius: "6px",
  padding: "12px",
  fontSize: "14px",
  color: "#212121",
  outline: "none",
  transition: "border-color 200ms ease, box-shadow 200ms ease",
  minHeight: "44px",
};

const filterInputFocusHandler = (e) => {
  e.target.style.borderColor = "#2E7D32";
  e.target.style.boxShadow = "0 0 0 2px rgba(46,125,50,0.2)";
};

const filterInputBlurHandler = (e) => {
  e.target.style.borderColor = "#E0E0E0";
  e.target.style.boxShadow = "none";
};

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

  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEditOpen = (record) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedRecord(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
        handleCloseForm();
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
    const s = status?.toLowerCase();
    switch (s) {
      case "completado":
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "en curso":
      case "in progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pendiente":
      case "pending":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelado":
      case "canceled":
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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

  if (showForm) {
    return (
      <HealthRecordForm
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
        initialData={selectedRecord}
      />
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
                onClick={handleCreateOpen}
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

      {/* ═══ Filters Section — DESIGN.md: Card bg #FFFFFF, border-radius 12px, shadow, padding 20px 24px ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          padding: "20px 24px",
        }}
      >
        <div className="flex flex-col gap-5">
          {/* Search input with visible label */}
          <div>
            <label
              htmlFor="health-search-input"
              style={{
                display: "block",
                fontSize: "10px",
                color: "#9E9E9E",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "6px",
              }}
            >
              Buscar animal
            </label>
            <div style={{ position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "18px",
                  height: "18px",
                  color: "#2E7D32",
                  pointerEvents: "none",
                }}
              />
              <input
                id="health-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por animal..."
                style={{
                  ...filterInputStyle,
                  width: "100%",
                  paddingLeft: "40px",
                }}
                onFocus={filterInputFocusHandler}
                onBlur={filterInputBlurHandler}
              />
            </div>
          </div>

          {/* Filters row: mobile stacked, desktop inline */}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}
          >
            {/* Type filter */}
            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
              <label
                htmlFor="health-filter-type"
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#9E9E9E",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                }}
              >
                Tipo de registro
              </label>
              <div style={{ position: "relative" }}>
                <Filter
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#2E7D32",
                    pointerEvents: "none",
                  }}
                />
                <select
                  id="health-filter-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    ...filterInputStyle,
                    width: "100%",
                    paddingLeft: "38px",
                    paddingRight: "32px",
                    appearance: "none",
                    cursor: "pointer",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239E9E9E' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "16px",
                  }}
                  onFocus={filterInputFocusHandler}
                  onBlur={filterInputBlurHandler}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Chequeo">Chequeo</option>
                  <option value="Tratamiento">Tratamiento</option>
                  <option value="Desparasitación">Desparasitación</option>
                </select>
              </div>
            </div>

            {/* Date From */}
            <div style={{ flex: "1 1 160px", minWidth: 0 }}>
              <label
                htmlFor="health-filter-date-from"
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#9E9E9E",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                }}
              >
                Desde
              </label>
              <div style={{ position: "relative" }}>
                <Calendar
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#2E7D32",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="health-filter-date-from"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  style={{
                    ...filterInputStyle,
                    width: "100%",
                    paddingLeft: "38px",
                  }}
                  onFocus={filterInputFocusHandler}
                  onBlur={filterInputBlurHandler}
                />
              </div>
            </div>

            {/* Date To */}
            <div style={{ flex: "1 1 160px", minWidth: 0 }}>
              <label
                htmlFor="health-filter-date-to"
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#9E9E9E",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                }}
              >
                Hasta
              </label>
              <div style={{ position: "relative" }}>
                <Calendar
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#2E7D32",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="health-filter-date-to"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  style={{
                    ...filterInputStyle,
                    width: "100%",
                    paddingLeft: "38px",
                  }}
                  onFocus={filterInputFocusHandler}
                  onBlur={filterInputBlurHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Records List ═══ */}
      <div className="grid grid-cols-1 gap-5">
        {records.map((record, index) => {
          const badgeColor = getBadgeColorByType(record.type);
          const isDisabledEdit =
            record.status === "Completado" ||
            record.status === "completed" ||
            record.status === "Cancelado" ||
            record.status === "canceled";

          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  padding: "20px 24px",
                  transition: "all 200ms ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px rgba(0,0,0,0.05)";
                }}
              >
                {/* ── Fila 1: Badge tipo + fecha ── */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: badgeColor.bg,
                      color: badgeColor.text,
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {record.type}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "#9E9E9E",
                      fontWeight: 500,
                    }}
                  >
                    <Calendar
                      style={{ width: "14px", height: "14px", color: "#9E9E9E" }}
                    />
                    {record.date}
                  </div>
                </div>

                {/* ── Fila 2: Animal name + status badge + edit btn ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    {/* ClipboardList icon per DESIGN.md */}
                    <div
                      style={{
                        background: "#E8F5E9",
                        borderRadius: "8px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ClipboardList
                        style={{ width: "22px", height: "22px", color: "#2E7D32" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <Tag
                        style={{ width: "16px", height: "16px", color: "#212121", flexShrink: 0 }}
                      />
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#212121",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {record.animalName || record.animal || record.animalId || "Sin nombre"}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border tracking-wider",
                        getStatusColor(record.statusStyle || record.status),
                      )}
                    >
                      {record.status}
                    </span>
                    {!isDisabledEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(record);
                        }}
                        title="Editar registro"
                        style={{
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          border: "1px solid #E0E0E0",
                          background: "#FFFFFF",
                          color: "#2E7D32",
                          cursor: "pointer",
                          transition: "all 200ms ease",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#E8F5E9";
                          e.currentTarget.style.borderColor = "#2E7D32";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#FFFFFF";
                          e.currentTarget.style.borderColor = "#E0E0E0";
                        }}
                      >
                        <Pencil style={{ width: "16px", height: "16px" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Fila 3: Descripción en cursiva ── */}
                {(record.description || record.diagnosis) && (
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#9E9E9E",
                      fontSize: "14px",
                      margin: "0 0 16px 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.5",
                    }}
                  >
                    "{record.description || record.diagnosis}"
                  </p>
                )}

                {/* ── Separador ── */}
                <div
                  style={{
                    borderTop: "1px solid #F5F5F5",
                    paddingTop: "16px",
                  }}
                >
                  {/* ── Fila 4: Info grid con labels explícitas ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Veterinario */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div
                        style={{
                          background: "#F5F5F5",
                          borderRadius: "6px",
                          padding: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <User style={{ width: "14px", height: "14px", color: "#2E7D32" }} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#9E9E9E",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            display: "block",
                            marginBottom: "2px",
                          }}
                        >
                          Veterinario
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#212121",
                            fontWeight: 600,
                          }}
                        >
                          {record.veterinarian || "Dr. No asignado"}
                        </span>
                      </div>
                    </div>

                    {/* Fecha evento */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div
                        style={{
                          background: "#F5F5F5",
                          borderRadius: "6px",
                          padding: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <Calendar style={{ width: "14px", height: "14px", color: "#2E7D32" }} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#9E9E9E",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            display: "block",
                            marginBottom: "2px",
                          }}
                        >
                          Fecha evento
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#212121",
                            fontWeight: 600,
                          }}
                        >
                          {record.date}
                        </span>
                      </div>
                    </div>

                    {/* Diagnóstico — solo si existe */}
                    {(record.diagnosis || record.description) && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div
                          style={{
                            background: "#F5F5F5",
                            borderRadius: "6px",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <Stethoscope style={{ width: "14px", height: "14px", color: "#2E7D32" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#9E9E9E",
                              textTransform: "uppercase",
                              fontWeight: 700,
                              letterSpacing: "0.12em",
                              display: "block",
                              marginBottom: "2px",
                            }}
                          >
                            Diagnóstico
                          </span>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#212121",
                              fontWeight: 600,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: "1.4",
                            }}
                          >
                            {record.diagnosis || record.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tratamiento — solo si existe */}
                    {record.treatment && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div
                          style={{
                            background: "#F5F5F5",
                            borderRadius: "6px",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <Pill style={{ width: "14px", height: "14px", color: "#2E7D32" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#9E9E9E",
                              textTransform: "uppercase",
                              fontWeight: 700,
                              letterSpacing: "0.12em",
                              display: "block",
                              marginBottom: "2px",
                            }}
                          >
                            Tratamiento
                          </span>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#212121",
                              fontWeight: 600,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: "1.4",
                            }}
                          >
                            {record.treatment}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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
    </div>
  );
}

// IMPORTANTE: Exportación por defecto necesaria para React.lazy
export default HealthRecordsView;
