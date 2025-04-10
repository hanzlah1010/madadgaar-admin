import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCrewMember from "../../Components/Crew/AddCrewMember";
import CrewList from "../../Components/Crew/CrewList";

const MedicalCrewPage = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("medical"); // 'medical' or 'driving'

  useEffect(() => {
    // Dummy data for initial crew members with categories
    const initialCrew = [
      {
        id: 1,
        name: "Dr. Aisha Khan",
        role: "Paramedic",
        category: "medical",
        status: "Available",
      },
      {
        id: 2,
        name: "Imran Ali",
        role: "EMT",
        category: "medical",
        status: "On Duty",
      },
      {
        id: 3,
        name: "Sara Ahmed",
        role: "Nurse",
        category: "medical",
        status: "Available",
      },
      {
        id: 4,
        name: "Usman Ghani",
        role: "Driver",
        category: "driving",
        status: "Available",
      },
      {
        id: 5,
        name: "Sardaar Khan",
        role: "Mechanic",
        category: "driving",
        status: "On Duty",
      },
    ];
    setCrewMembers(initialCrew);
  }, []);

  const handleAddCrewMember = (newMember) => {
    setCrewMembers([...crewMembers, { ...newMember, id: Date.now() }]);
  };

  const handleUpdateCrewMember = (updatedMember) => {
    const updatedCrew = crewMembers.map((member) =>
      member.id === updatedMember.id ? updatedMember : member
    );
    setCrewMembers(updatedCrew);
  };

  const handleDeleteCrewMember = (id) => {
    const updatedCrew = crewMembers.filter((member) => member.id !== id);
    setCrewMembers(updatedCrew);
  };

  const filteredCrew = crewMembers.filter(
    (member) => member.category === activeTab
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Medical Crew Management</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "medical" ? "active" : ""}`}
            onClick={() => setActiveTab("medical")}
          >
            Medical Crew
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "driving" ? "active" : ""}`}
            onClick={() => setActiveTab("driving")}
          >
            Driving & Maintenance Crew
          </button>
        </li>
      </ul>

      <AddCrewMember onAdd={handleAddCrewMember} currentTab={activeTab} />
      <CrewList
        crew={filteredCrew}
        onUpdate={handleUpdateCrewMember}
        onDelete={handleDeleteCrewMember}
      />
    </div>
  );
};

export default MedicalCrewPage;
