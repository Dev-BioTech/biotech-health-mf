/**
 * Get visual styles for health record type badges
 * @param {string} type - The type of medical record
 * @returns {object} Object with backgroundColor and textColor
 */
export const getBadgeColorByType = (type) => {
  const t = type?.toLowerCase();
  switch (t) {
    case 'chequeo':
    case 'check-up':
      return {
        bg: '#E8F5E9',
        text: '#2E7D32'
      };
    case 'vacunación':
    case 'vacunacion':
    case 'vaccination':
      return {
        bg: '#E3F2FD',
        text: '#1565C0'
      };
    case 'tratamiento':
    case 'treatment':
      return {
        bg: '#FFF3E0',
        text: '#F57C00'
      };
    case 'emergencia':
    case 'emergency':
      return {
        bg: '#FFEBEE',
        text: '#D32F2F'
      };
    case 'desparasitación':
    case 'desparasitacion':
    case 'deworming':
      return {
        bg: '#F3E5F5',
        text: '#6A1B9A'
      };
    default:
      return {
        bg: '#F5F5F5',
        text: '#9E9E9E'
      };
  }
};
