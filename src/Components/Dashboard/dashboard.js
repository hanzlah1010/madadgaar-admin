import React, { useEffect, useState } from "react";
import BarGraph from "../Graph/bargraph";
import MyGraph from "../Graph/linegraph";
import "bootstrap/dist/css/bootstrap.min.css";
import Cards from "./cards";
import apiController from "../../api/apiController";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState("---");
  const [userChartType, setUserChartType] = useState("DAILY");
  const [chartData, setChartData] = useState({}); // No type needed for JavaScript

  useEffect(() => {
    const fetchUsersCountAndChartData = async () => {
      try {
        if (usersCount === "N/A") setUsersCount("---");
        const response = await apiController.get(
          `/admin/usersInsights?chartType=${userChartType}`
        ); // Await the API call.

        // Set total user count
        setUsersCount(response?.data?.totalCount);

        // Set chart data
        if (response?.data?.insights) {
          setChartData(response.data.insights);
        }
      } catch (error) {
        console.error("Error fetching users count and chart data:", error);
        setUsersCount("N/A");
      }
    };

    fetchUsersCountAndChartData();
  }, [userChartType, usersCount]);

  return (
    <div className="row">
      <Cards usersCount={usersCount} />
      <div className="row">
        <div className="col-md-6">
          <MyGraph />
        </div>
        <div className="col-md-6">
          <BarGraph onSelectChange={setUserChartType} dataMap={chartData} />{" "}
          {/* Pass the mapped data */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
