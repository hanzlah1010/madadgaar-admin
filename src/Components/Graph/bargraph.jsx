import React, { useEffect, useState } from "react";
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
import { GraphFilterOptions } from "../../schemas/graph";

const BarGraph = ({ onSelectChange, dataMap, selectedType }) => {
  const [chartData, setChartData] = useState([]);

  // Handle dropdown change
  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    onSelectChange(newValue);
  };

  // Convert dataMap to chart data format
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <select
          className="form-select w-auto"
          value={selectedType}
          onChange={handleSelectChange}
        >
          {Object.values(GraphFilterOptions).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="added" fill="#8884d8" name="Users Added" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarGraph;
