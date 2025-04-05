import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const BarGraph = ({ onSelectChange, dataMap }) => {
  const [selectedValue, setSelectedValue] = useState("DAILY");
  const [chartData, setChartData] = useState([]);

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onSelectChange(newValue); // Tell parent about the change
  };

  // Convert dataMap (Record<string, number>) to array format for Recharts
  useEffect(() => {
    if (dataMap) {
      const transformed = Object.entries(dataMap).map(([key, value]) => ({
        name: key,
        added: value,
      }));
      setChartData(transformed);
    }
  }, [dataMap]);

  return (
    <div className="container-fluid">
      <h3 className="text-center mt-3">Users Added</h3>

      <div className="card shadow-lg p-4 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <select
            className="form-select w-auto"
            value={selectedValue}
            onChange={handleSelectChange}
          >
            <option value="DAILY">Daily</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div style={{ width: "100%", height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="added" fill="blue" name="Users Added" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
