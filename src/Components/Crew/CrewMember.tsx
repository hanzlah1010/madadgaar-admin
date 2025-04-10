import { useState } from "react";
import {
  crewCategories,
  CrewMemeber,
  crewStatus,
} from "../../schemas/crew_member";

const medicalRoles = ["Paramedic", "EMT", "Nurse"];
const drivingRoles = ["Driver", "Mechanic", "Technician"];

const CrewMember = ({
  member,
  onUpdate,
  onDelete,
}: {
  member: CrewMemeber;
  onUpdate: (updatedMember: CrewMemeber) => void;
  onDelete: (id: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [status, setStatus] = useState(member.status);

  const getRolesByCategory = (category: crewCategories) => {
    return category === crewCategories.MEDICAL ? medicalRoles : drivingRoles;
  };

  const handleSave = () => {
    onUpdate({ ...member, name, role, status });
    setIsEditing(false);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {isEditing ? (
        <>
          <input
            type="text"
            className="form-control form-control-sm me-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="form-select form-select-sm me-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {getRolesByCategory(member.category).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm me-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as crewStatus)}
          >
            {Object.entries(crewStatus).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
          <button className="btn btn-sm btn-success me-1" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div>
            <strong>{name}</strong> ({role}) -{" "}
            <span
              className={
                status === "Available"
                  ? "text-success"
                  : status === "On Duty"
                  ? "text-primary"
                  : "text-warning"
              }
            >
              {status}
            </span>
          </div>
          <div>
            <button
              className="btn btn-sm btn-primary me-1"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(member.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default CrewMember;
