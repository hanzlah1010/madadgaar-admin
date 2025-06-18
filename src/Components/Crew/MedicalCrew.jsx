import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DriverCrew = () => {
  const [crewList, setCrewList] = useState([]);
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [editId, setEditId] = useState(null); // If not null, editing mode

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.contact) {
      return alert("Please fill all fields");
    }

    if (editId) {
      const updatedList = crewList.map((member) =>
        member.id === editId ? { ...formData, id: editId } : member
      );
      setCrewList(updatedList);
      setEditId(null);
    } else {
      setCrewList([...crewList, { ...formData, id: Date.now() }]);
    }

    setFormData({ name: "", contact: "" });
  };

  const handleDelete = (id) => {
    setCrewList(crewList.filter((member) => member.id !== id));
  };

  const handleEdit = (member) => {
    setFormData({ name: member.name, contact: member.contact });
    setEditId(member.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", contact: "" });
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Driver Crew Management</h2>

      {/* Form */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">{editId ? "Edit Driver" : "Add Driver"}</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Driver Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Contact No."
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2">
            {editId && (
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
            <button className="btn btn-primary" onClick={handleAddOrUpdate}>
              {editId ? "Update Member" : "Add Member"}
            </button>
          </div>
        </div>
      </div>

      {/* Crew List */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crewList.length > 0 ? (
              crewList.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.contact}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No drivers added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverCrew;
