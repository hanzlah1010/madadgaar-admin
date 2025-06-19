import React, { useState } from "react"
import { FaDownload, FaFilter } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"

const Reports = () => {
  const [filter, setFilter] = useState("all")

  const reportData = [
    {
      date: "2025-06-18",
      name: "Ali",
      type: "Bike",
      region: "Lahore",
      status: "Completed",
      responseTime: "6 mins"
    },
    {
      date: "2025-06-17",
      name: "Fatima",
      type: "Van",
      region: "Gujranwala",
      status: "Cancelled",
      responseTime: "-"
    }
  ]

  const handleDownload = () => {
    const FilteredData = reportData.filter(
      (row) => filter === "all" || row.type === filter
    )
    const header = [
      "Date",
      "Caller Name",
      "Type",
      "Region",
      "Status",
      "Response Time"
    ]
    const rows = FilteredData.map((row) => [
      row.date,
      row.name,
      row.type,
      row.region,
      row.status,
      row.responseTime
    ])
    const csvcontent = [header, ...rows].map((e) => e.join(",")).join("\n")
    const blob = new Blob([csvcontent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "service_reports.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container reports-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Service Reports</h2>
        <button className="btn btn-success" onClick={handleDownload}>
          <FaDownload className="me-2" /> Download Report
        </button>
      </div>

      <div className="mb-3 d-flex gap-3 align-items-center">
        <FaFilter />
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Bike">Bike Ambulance</option>
          <option value="Van">Van Ambulance</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Caller Name</th>
              <th>Type</th>
              <th>Region</th>
              <th>Status</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
            {reportData
              .filter((row) => filter === "all" || row.type === filter)
              .map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.region}</td>
                  <td>{row.status}</td>
                  <td>{row.responseTime}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
