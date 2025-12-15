import HealthDashboard from "./features/dashboard/components/HealthDashboard";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <HealthDashboard
        onViewRecords={() => console.log("Ver Registros")}
        onViewCalendar={() => console.log("Ver Calendario")}
      />
    </div>
  );
}

export default App;
