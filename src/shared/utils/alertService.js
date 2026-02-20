import Swal from "sweetalert2";

// Bus de eventos para comunicación entre microfrontends
const addToast = (message, type) => {
  window.dispatchEvent(
    new CustomEvent("biotech-toast", {
      detail: { message, type },
    }),
  );
};

// Custom base configuration for SweetAlert (Modals)
const baseConfig = {
  customClass: {
    popup: "biotech-alert-popup",
    title: "biotech-alert-title",
    htmlContainer: "biotech-alert-text",
    confirmButton: "biotech-alert-confirm",
    cancelButton: "biotech-alert-cancel",
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
};

// Custom colors for SweetAlert icons
const alertColors = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  question: "#8b5cf6",
};

// Success Notification (Unified)
export const showSuccess = (message, title = "¡Éxito!") => {
  addToast(message, "success");
  return Promise.resolve(); // Mantener compatibilidad con llamadas .then()
};

// Error Notification (Unified)
export const showError = (message, title = "Error") => {
  addToast(message, "error");
  return Promise.resolve();
};

// Info Notification (Unified)
export const showInfo = (message, title = "Información") => {
  addToast(message, "info");
  return Promise.resolve();
};

// Warning Notification (Unified)
export const showWarning = (message, title = "Advertencia") => {
  addToast(message, "warning");
  return Promise.resolve();
};

// Las confirmaciones siguen usando Swal por ser modales de interrupción
export const showConfirm = (
  message,
  title = "¿Estás seguro?",
  confirmText = "Sí, confirmar",
  cancelText = "Cancelar",
) => {
  return Swal.fire({
    ...baseConfig,
    icon: "question",
    title,
    text: message,
    iconColor: alertColors.question,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

// Delete confirm alert
export const showDeleteConfirm = (
  itemName = "este elemento",
  message = "Esta acción no se puede deshacer",
) => {
  return Swal.fire({
    ...baseConfig,
    icon: "warning",
    title: `¿Eliminar ${itemName}?`,
    text: message,
    iconColor: alertColors.error,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    confirmButtonColor: alertColors.error,
  });
};

// Loading alert
export const showLoading = (
  message = "Procesando...",
  title = "Por favor espera",
) => {
  return Swal.fire({
    ...baseConfig,
    title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading alert
export const closeLoading = () => {
  Swal.close();
};

// Toast notification alias for unified system
export const showToast = (message, type = "success") => {
  addToast(message, type);
  return Promise.resolve();
};

// Custom alert (Mantiene Swal para casos complejos)
export const showCustomAlert = (options) => {
  return Swal.fire({
    ...baseConfig,
    ...options,
  });
};

// Alert service object
const alertService = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  confirm: showConfirm,
  deleteConfirm: showDeleteConfirm,
  loading: showLoading,
  closeLoading,
  toast: showToast,
  custom: showCustomAlert,
};

export default alertService;
