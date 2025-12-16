import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  plugins: [
    react(),
    federation({
      name: "healthMF",
      filename: "remoteEntry.js",
      exposes: {
        "./HealthDashboard":
          "./src/features/dashboard/components/HealthDashboard.jsx",
        "./HealthRecordsView":
          "./src/features/health-records/components/HealthRecordsView.jsx",
        "./VaccinationCalendar":
          "./src/features/vaccination/components/VaccinationCalendar.jsx",
        "./HealthRecords":
          "./src/features/health-records/components/HealthRecords.jsx",
        "./DiagnosticHistory":
          "./src/features/health-records/components/DiagnosticHistory.jsx",
        "./HealthStore": "./src/shared/store/healthStore.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "react-router-dom": {
          singleton: true,
        },
        zustand: { singleton: true },
        "framer-motion": { singleton: true },
        "lucide-react": { singleton: true },
        axios: {},
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5004,
    cors: true,
  },
});
