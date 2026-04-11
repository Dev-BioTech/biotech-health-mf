export const HEALTH_STATUS = {
  HEALTHY: 'Saludable',
  SICK: 'Enfermo',
  RECOVERING: 'En Recuperación',
  CRITICAL: 'Crítico'
}

export const VACCINE_TYPES = {
  RABIES: 'Rabia',
  BRUCELLOSIS: 'Brucelosis',
  TUBERCULOSIS: 'Tuberculosis',
  ANTHRAX: 'Ántrax',
  CLOSTRIDIAL: 'Clostridiosis'
}

export const TREATMENT_TYPES = {
  ANTIBIOTIC: 'Antibiótico',
  ANTIPARASITIC: 'Antiparasitario',
  ANTI_INFLAMMATORY: 'Antiinflamatorio',
  VITAMIN: 'Vitamina',
  OTHER: 'Otro'
}

export const HEALTH_RECORD_TYPES = [
  { value: "Chequeo", label: "CHEQUEO GENERAL" },
  { value: "Vacunación", label: "VACUNACIÓN" },
  { value: "Tratamiento", label: "TRATAMIENTO ESPECÍFICO" },
  { value: "Desparasitación", label: "DESPARASITACIÓN" },
  { value: "Emergencia", label: "EMERGENCIA / URGENCIAS" },
];

export const PROCEDURE_STATUSES = [
  { value: "Pendiente", label: "PENDIENTE" },
  { value: "En Curso", label: "EN CURSO" },
  { value: "Completado", label: "COMPLETADO" },
  { value: "Cancelado", label: "CANCELADO" },
];