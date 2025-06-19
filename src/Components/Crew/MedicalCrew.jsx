import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import apiController from "../../api/apiController"

const initialForm = {
  name: "",
  phone: "",
  cnic: "",
  email: "",
  role: "DRIVER",
  stationId: ""
}

const PAGE_SIZE = 10

const DriverCrew = () => {
  const [crewList, setCrewList] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const fetchCrewList = async () => {
    try {
      const response = await apiController.get("/admin/crewMembers")
      setCrewList(response?.data || [])
    } catch (error) {
      toast.error("Failed to load crew members")
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchCrewList()
  }, [])

  const handleAddOrUpdate = async (e) => {
    e.preventDefault()
    const requiredFields = [
      "name",
      "phone",
      "cnic",
      "email",
      "role",
      "stationId"
    ]
    const isIncomplete = requiredFields.some((field) => !formData[field])
    if (isIncomplete) return toast.error("Please fill all fields")

    setLoading(true)

    try {
      if (editId) {
        const { data } = await apiController.put(
          `/admin/crewMembers/${editId}`,
          formData
        )
        const updatedList = crewList.map((member) =>
          member.id === editId ? { ...data } : member
        )
        setCrewList(updatedList)
        toast.success("Member updated successfully")
        setEditId(null)
      } else {
        const { data } = await apiController.post(
          "/admin/crewMembers",
          formData
        )
        setCrewList([data, ...crewList])
        toast.success("Member added successfully")
      }
      setFormData(initialForm)
    } catch (error) {
      toast.error(editId ? "Failed to update member" : "Failed to add member")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiController.delete(`/admin/crewMembers/${id}`)
      setCrewList(crewList.filter((member) => member.id !== id))
      toast.success("Member deleted")
    } catch (error) {
      toast.error("Failed to delete member")
    }
  }

  const handleEdit = (member) => {
    setFormData({ ...member })
    setEditId(member.id)
    document.getElementsByName("name")[0]?.focus()
  }

  const handleCancelEdit = () => {
    setFormData(initialForm)
    setEditId(null)
  }

  const totalPages = Math.ceil(crewList.length / PAGE_SIZE)
  const paginatedList = crewList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Driver Crew Management</h2>

      <form onSubmit={handleAddOrUpdate} className="card p-4 mb-4 shadow">
        <h5 className="mb-3">{editId ? "Edit Member" : "Add Member"}</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="CNIC"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="DRIVER">Driver</option>
              <option value="OPERATOR">Operator</option>
            </select>
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Station ID"
              name="stationId"
              value={formData.stationId}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2">
            {editId && (
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? editId
                  ? "Updating..."
                  : "Adding..."
                : editId
                ? "Update Member"
                : "Add Member"}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive shadow-sm">
        {initialLoading ? (
          <div className="text-center py-5 text-muted">
            Loading crew members...
          </div>
        ) : (
          <>
            <table className="table table-bordered table-striped text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>CNIC</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Station ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.phone}</td>
                      <td>{member.cnic}</td>
                      <td>{member.email}</td>
                      <td>{member.role}</td>
                      <td>{member.stationId}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-warning btn-sm"
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {crewList.length > PAGE_SIZE && (
              <div className="d-flex justify-content-between align-items-center px-2 mt-3">
                <span className="text-muted">
                  Page {currentPage} of {totalPages}
                </span>
                <div>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DriverCrew
