import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import "bootstrap/dist/css/bootstrap.min.css"
import { GraphFilterOptions } from "../../schemas/graph"

interface LineGraphProps {
  onSelectChange: (newType: GraphFilterOptions) => void
  dataMap: Record<string, any>[]
  selectedType: GraphFilterOptions
}

const MyGraph = ({ onSelectChange, dataMap, selectedType }: LineGraphProps) => {
  return (
    <div className="container-fluid">
      <div className="card shadow-lg p-4 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <select
            className="form-select w-auto"
            value={selectedType}
            onChange={(e) =>
              onSelectChange(e.target.value as GraphFilterOptions)
            }
          >
            <option value={GraphFilterOptions.DAILY}>Daily</option>
            <option value={GraphFilterOptions.MONTHLY}>Monthly</option>
            <option value={GraphFilterOptions.YEARLY}>Yearly</option>
          </select>
        </div>

        <div style={{ width: "100%", height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataMap}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="orange"
                strokeWidth={2}
                name="Pending"
              />
              <Line
                type="monotone"
                dataKey="succeeded"
                stroke="green"
                strokeWidth={2}
                name="Succeeded"
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="red"
                strokeWidth={2}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MyGraph
