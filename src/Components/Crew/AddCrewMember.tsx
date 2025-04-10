import { FormEvent, useState } from "react";
import {
  crewCategories,
  CrewMemeber,
  crewStatus,
} from "../../schemas/crew_member";

const medicalRoles = ["Paramedic", "EMT", "Nurse"];
const drivingRoles = ["Driver", "Mechanic", "Technician"];

const AddCrewMember = ({
  onAdd,
  currentTab,
}: {
  onAdd: (newMember: CrewMemeber) => void;
  currentTab: crewCategories;
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const getRolesByCategory = (category: crewCategories) => {
    return category === "medical" ? medicalRoles : drivingRoles;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && role) {
      onAdd({
        name,
        role,
        status: crewStatus.AVAILABLE,
        category: currentTab,
        id: 0,
      });
      setName("");
      setRole("");
    }
  };

  return (
    <div className="mb-3">
      <h3>Add New Crew Member</h3>
      <form onSubmit={handleSubmit} className="row g-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-auto">
          <label htmlFor="role" className="form-label">
            Role:
          </label>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            {getRolesByCategory(currentTab).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Add Crew
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCrewMember;
