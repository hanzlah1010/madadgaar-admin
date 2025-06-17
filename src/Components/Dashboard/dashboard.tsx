import React, { useEffect, useState } from "react";
import BarGraph from "../Graph/bargraph";
import MyGraph from "../Graph/linegraph";
import "bootstrap/dist/css/bootstrap.min.css";
import Cards from "./cards";
import apiController from "../../api/apiController";
import { GraphFilterOptions } from "../../schemas/graph";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState("---");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userChartType, setUserChartType] = useState<GraphFilterOptions>(
    GraphFilterOptions.DAILY
  );
  const [chartData, setChartData] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiController.get(
        `/admin/usersInsights?chartType=${userChartType.toUpperCase()}`
      );

      // Set total user count
      setUsersCount(response?.data?.totalCount || "N/A");

      // Set chart data
      if (response?.data?.insights) {
        setChartData(response.data.insights);
      }
    } catch (error) {
      console.error("Error fetching users count and chart data:", error);
      setUsersCount("N/A");
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (newType: GraphFilterOptions) => {
    setUserChartType(newType);
  };

  useEffect(() => {
    fetchData();
  }, [userChartType]);

  return (
    <div className="row">
      {error && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="col-12">
        <Cards usersCount={usersCount} isLoading={isLoading} />
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Ambulances</h5>
                <div style={{ minHeight: "300px" }}>
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading graph data...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <MyGraph />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">User Added</h5>
                <div style={{ minHeight: "300px" }}>
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading graph data...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <BarGraph
                      onSelectChange={handleChartTypeChange}
                      dataMap={chartData}
                      selectedType={userChartType}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
