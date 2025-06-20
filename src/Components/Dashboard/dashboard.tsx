import React, { useEffect, useState } from "react"
import BarGraph from "../Graph/bargraph"
import MyGraph from "../Graph/linegraph"
import "bootstrap/dist/css/bootstrap.min.css"
import Cards from "./cards"
import apiController from "../../api/apiController"
import { GraphFilterOptions } from "../../schemas/graph"

type DashboardState = {
  usersCount: string | null
  activeAmbulanceCount: string | null
  pendingRequestsCount: string | null
  usersChartData: Record<string, any>
  userChartType: GraphFilterOptions
  emergenciesChartData: Record<string, any>[]
  emergenciesChartType: GraphFilterOptions
  isLoading: boolean
  error: string | null
}

const Dashboard = () => {
  const [state, setState] = useState<DashboardState>({
    usersCount: null,
    activeAmbulanceCount: null,
    pendingRequestsCount: null,
    usersChartData: {},
    userChartType: GraphFilterOptions.DAILY,
    emergenciesChartData: [],
    emergenciesChartType: GraphFilterOptions.DAILY,
    isLoading: false,
    error: null
  })

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await apiController.get(
        `/admin/usersInsights?chartType=${state.userChartType.toUpperCase()}&emergenciesChartType=${state.emergenciesChartType.toUpperCase()}`
      )

      setState((prev) => ({
        ...prev,
        usersCount: response?.data?.usersCount || "N/A",
        activeAmbulanceCount: response?.data?.activeAmbulanceCount || "N/A",
        pendingRequestsCount: response?.data?.pendingRequestsCount || "N/A",
        usersChartData: response?.data?.usersChartData || {},
        emergenciesChartData: response?.data?.emergenciesChartData || [],
        isLoading: false,
        error: null
      }))
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      setState((prev) => ({
        ...prev,
        usersCount: "N/A",
        error: "Failed to load dashboard data. Please try again.",
        isLoading: false
      }))
    }
  }

  const handleUserChartTypeChange = (newType: GraphFilterOptions) => {
    setState((prev) => ({
      ...prev,
      userChartType: newType,
      usersChartData: {}
    }))
  }

  const handleEmergenciesChartTypeChange = (newType: GraphFilterOptions) => {
    setState((prev) => ({
      ...prev,
      emergenciesChartType: newType,
      emergenciesChartData: []
    }))
  }

  useEffect(() => {
    fetchData()
  }, [state.userChartType, state.emergenciesChartType])

  const {
    usersCount,
    activeAmbulanceCount,
    pendingRequestsCount,
    usersChartData,
    userChartType,
    emergenciesChartData,
    emergenciesChartType,
    isLoading,
    error
  } = state

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
        <Cards
          activeAmbulanceCount={activeAmbulanceCount}
          usersCount={usersCount}
          isLoading={isLoading}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Reports</h5>
                <div style={{ minHeight: "300px" }}>
                  {isLoading && emergenciesChartData.length === 0 ? (
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
                    <MyGraph
                      onSelectChange={handleEmergenciesChartTypeChange}
                      dataMap={emergenciesChartData}
                      selectedType={emergenciesChartType}
                    />
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
                  {isLoading && Object.keys(usersChartData).length === 0 ? (
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
                      onSelectChange={handleUserChartTypeChange}
                      dataMap={usersChartData}
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
  )
}

export default Dashboard
