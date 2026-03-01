import { useState } from "react";
import HealthDashboard from "./features/dashboard/components/HealthDashboard";
import { HealthRecordsView } from "./features/health-records/components/HealthRecordsView";
import { VaccinationCalendar } from "./features/vaccination/components/VaccinationCalendar";
import DiagnosticHistory from "./features/health-records/components/DiagnosticHistory";

import "./index.css";

function App() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return (
          <HealthDashboard
            onViewRecords={() => setView("records")}
            onViewCalendar={() => setView("calendar")}
            onViewDiagnostics={() => setView("diagnostics")}
          />
        );
      case "records":
        return <HealthRecordsView onBack={() => setView("dashboard")} />;
      case "calendar":
        return <VaccinationCalendar onBack={() => setView("dashboard")} />;
      case "diagnostics":
        return <DiagnosticHistory onBack={() => setView("dashboard")} />;
      default:
        return <HealthDashboard onViewRecords={() => setView("records")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">{renderView()}</div>
    </div>
  );
}

export default App;
