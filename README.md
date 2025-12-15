# 🏥 BioTech Health - Gestión de Salud Animal

Módulo de control sanitario y registros médicos veterinarios.

## 🚀 Características

- **Registros médicos**: Historial completo de salud
- **Calendario de vacunación**: Control de vacunas
- **Tratamientos**: Registro de medicamentos
- **Diagnósticos**: Base de datos de enfermedades
- **Alertas sanitarias**: Notificaciones preventivas
- **Reportes**: Estadísticas de salud del hato
- **Gestión de veterinarios**: Registro de profesionales

## 🛠️ Tecnologías

- React 18
- Vite + Module Federation
- React Hook Form + Yup
- Axios
- Zustand
- Tailwind CSS

## 📦 Instalación

```bash
npm install
npm run dev  # Puerto 5004
```

## 🔌 Componentes Expuestos

```javascript
// Registros de salud
import('healthMF/HealthRecords')

// Calendario de vacunación
import('healthMF/VaccinationSchedule')

// Historial de tratamientos
import('healthMF/TreatmentHistory')

// Store
import('healthMF/HealthStore')
```

## 📁 Estructura

```
src/
├── features/
│   ├── health-records/
│   │   ├── components/
│   │   │   └── HealthRecords.jsx
│   │   ├── hooks/
│   │   │   └── useHealthRecords.js
│   │   └── services/
│   ├── vaccination/
│   │   ├── components/
│   │   │   └── VaccinationSchedule.jsx
│   │   └── services/
│   └── treatment/
│       ├── components/
│       ├── validations/
│       └── services/
├── shared/
│   ├── store/
│   │   └── healthStore.js
│   ├── constants/
│   │   └── healthConstants.js
│   └── utils/
└── App.jsx
```

## 💉 Estados de Salud

```javascript
export const HEALTH_STATUS = {
  HEALTHY: 'Saludable',
  SICK: 'Enfermo',
  RECOVERING: 'En Recuperación',
  CRITICAL: 'Crítico'
}
```

## 💊 Tipos de Vacunas

```javascript
export const VACCINE_TYPES = {
  RABIES: 'Rabia',
  BRUCELLOSIS: 'Brucelosis',
  TUBERCULOSIS: 'Tuberculosis',
  ANTHRAX: 'Ántrax',
  CLOSTRIDIAL: 'Clostridiosis'
}
```

## 🌍 API Endpoints

```javascript
GET    /api/health/records             // Registros médicos
POST   /api/health/records             // Crear registro
GET    /api/health/vaccinations        // Vacunaciones
POST   /api/health/vaccinations        // Programar vacuna
GET    /api/health/treatments          // Tratamientos
POST   /api/health/treatments          // Nuevo tratamiento
GET    /api/health/stats               // Estadísticas
```

## 📋 Registro Médico

```typescript
interface HealthRecord {
  id: number
  animalId: number
  date: Date
  veterinarian: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  medications: [
    {
      name: string
      dose: string
      frequency: string
      duration: number
    }
  ]
  status: string
  followUpDate?: Date
  notes?: string
}
```

## 📅 Calendario de Vacunación

```typescript
interface Vaccination {
  id: number
  animalId: number
  vaccineType: string
  date: Date
  nextDose?: Date
  veterinarian: string
  batchNumber: string
  status: 'Pendiente' | 'Completado'
}
```

## 📊 Reportes de Salud

- Estado general del hato
- Cobertura de vacunación
- Incidencia de enfermedades
- Costos veterinarios
- Tratamientos activos

## 🔔 Alertas

```javascript
// Notificaciones automáticas
- Vacunación próxima (7 días antes)
- Seguimiento médico pendiente
- Tratamiento a finalizar
- Estado crítico de animal
```

## 🚀 Deploy

```bash
npm run build
vercel --prod
```

## 📞 Contacto

- Email: health@biotech.com
- Docs: https://docs.biotech.com/health
```