import { Routes, Route } from "react-router-dom";
import Sidebar from "./Components/SideBar/Sidebar";
import Dashboard from "./Components/Dashboard/dashboard";
import LiveTracking from "./Components/Live Tracking/LiveTracking";
import ManageRequests from "./Components/Manage Requests/managerequests";
import Ambulances from "./Components/Ambulances/ambulance";
import Auth from "./Components/Users/login";
import Signup from "./Components/Users/Signup";
import MedicalCrewPage from "./pages/Crew";
import Reports from './Components/Reports/Reports';
import MedicalCrew from "./Components/Crew/MedicalCrew";
import AccidentDetections from "./Components/AI Detection/AIDetection";

function App() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className="flex-grow-1 p-4 bg-light overflow-auto"
        style={{ marginLeft: "250px", height: "100vh" }}
      >
        <Routes>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />

          <Route path="/ambulances" element={<Ambulances />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/reports" element={<Reports />} />
          <Route path="/accidentdetection" element={<AccidentDetections />} />
          <Route path="/livetracking" element={<LiveTracking />} />
          <Route path="/managerequests" element={<ManageRequests />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/crew" element={<MedicalCrew />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
