import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Ambulance } from "../../schemas/ambulance";
import apiController from "../../api/apiController";

const AmbulancesScreen = () => {
  // State for ambulance data
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Keep for list operations
  const [error, setError] = useState<string | null>(null); // Keep for list operations

  // New states for add operation
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // New states for edit operation
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalVehicles, setTotalVehicles] = useState(0);

  // City filter states
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Status filter states
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "UNAVAILABLE_TEMPORARILY", label: "Temporarily Unavailable" },
    { value: "DISPATCHED", label: "Dispatched" },
    { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
    { value: "OUT_OF_SERVICE", label: "Out of Service" },
  ];

  // New state variables for vehicle details modal
  const [selectedVehicle, setSelectedVehicle] = useState<Ambulance | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Add near the top with other state definitions
  const [userRole, setUserRole] = useState("admin"); // Default to admin for testing
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Ambulance>>({
    plateNumber: "",
    model: "",
    modelYear: new Date().getFullYear(),
    capacity: 4,
    type: "AMBULANCE",
    status: "AVAILABLE",
    assignedToId: 0,
  });

  // Add near the top with other state definitions
  const [stationSearchTerm, setStationSearchTerm] = useState("");
  const [stationSearchResults, setStationSearchResults] = useState<
    { id: number; name: string; city: string }[]
  >([]);
  const [isSearchingStations, setIsSearchingStations] = useState(false);
  const [showStationDropdown, setShowStationDropdown] = useState(false);

  // Add this function near your other utility functions
  const getVehicleTypeIcon = (type: string): string => {
    // Icon mapping based on vehicle type
    switch (type) {
      case "AMBULANCE":
        return "heart-pulse"; // Ambulance icon (Mercedes Sprinter)
      case "FIRST_RESPONDER":
        return "bicycle"; // Bike icon for first responders
      case "FIRE_TRUCK":
        return "fire"; // Fire icon for fire trucks
      case "OTHER":
        return "car-front"; // Generic vehicle icon
      default:
        return "ambulance"; // Default fallback
    }
  };

  // Add this function to get both icon and color
  const getVehicleTypeDisplay = (type: string) => {
    // Type to icon and color mapping
    switch (type) {
      case "AMBULANCE":
        return { icon: "heart-pulse", color: "primary" }; // Blue for ambulances
      case "FIRST_RESPONDER":
        return { icon: "bicycle", color: "success" }; // Green for first responders
      case "FIRE_TRUCK":
        return { icon: "fire", color: "danger" }; // Red for fire trucks
      case "OTHER":
        return { icon: "car-front", color: "secondary" }; // Gray for other vehicles
      default:
        return { icon: "ambulance", color: "info" }; // Light blue as default
    }
  };

  // Add after other modal handling functions

  // Function to handle opening the add vehicle modal
  const openAddVehicleModal = () => {
    // Reset form data
    setFormData({
      plateNumber: "",
      model: "",
      modelYear: new Date().getFullYear(),
      capacity: 4,
      type: "AMBULANCE",
      status: "AVAILABLE",
      assignedToId: 0,
    });
    setStationSearchTerm("");
    setShowAddModal(true);
  };

  // Function to handle closing the add vehicle modal
  const closeAddVehicleModal = () => {
    setShowAddModal(false);
    setAddError(null); // Clear add error when closing modal
  };

  // Function to handle opening the edit vehicle modal
  const openEditVehicleModal = (vehicle: Ambulance) => {
    setFormData({
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      modelYear: vehicle.modelYear,
      capacity: vehicle.capacity,
      type: vehicle.type,
      status: vehicle.status,
      assignedToId: vehicle.assignedToId,
      unavailableUntil: vehicle.unavailableUntil,
      lastMaintenanceAt: vehicle.lastMaintenanceAt,
    });
    // Set the station search term to display the currently assigned station
    setStationSearchTerm(
      vehicle.assignedTo
        ? `${vehicle.assignedTo.name}, ${vehicle.assignedTo.city}`
        : ""
    );
    setShowEditModal(true);
  };

  // Function to handle closing the edit vehicle modal
  const closeEditVehicleModal = () => {
    setShowEditModal(false);
    setEditError(null); // Clear edit error when closing modal
  };

  // Function to handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "modelYear" || name === "capacity" || name === "assignedToId"
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Function to handle form submission for adding vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddError(null); // Reset add error state
      setIsAddLoading(true); // Use add-specific loading state

      // Transform formData to match AddVehicleDTO
      const addVehicleData = {
        plateNumber: formData.plateNumber,
        model: formData.model,
        modelYear: formData.modelYear,
        capacity: formData.capacity,
        type: formData.type,
        status: formData.status,
        stationId: formData.assignedToId, // DTO expects stationId, not assignedToId
        unavailableUntil: formData.unavailableUntil,
        lastMaintenanceAt: formData.lastMaintenanceAt,
      };

      const response = await apiController.post(
        "/admin/vehicles",
        addVehicleData
      );
      if (response.status === 201) {
        closeAddVehicleModal();
        // Refresh the list
        fetchAmbulances();
      }
    } catch (err: any) {
      console.error("Failed to add vehicle:", err);
      // Use the specific error state
      setAddError(
        err.response?.data?.message ||
          "Failed to add vehicle. Please try again."
      );
    } finally {
      setIsAddLoading(false); // Use add-specific loading state
    }
  };

  // Function to handle form submission for editing vehicle
  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEditError(null); // Reset edit error state
      setIsEditLoading(true); // Use edit-specific loading state

      // Create vehicle update data that matches UpdateVehicleRequestDTO
      const updateVehicleData = {
        id: formData.id,
        vehicleData: {
          plateNumber: formData.plateNumber,
          model: formData.model,
          modelYear: formData.modelYear,
          capacity: formData.capacity,
          type: formData.type,
          status: formData.status,
          stationId: formData.assignedToId, // DTO expects stationId, not assignedToId
          unavailableUntil: formData.unavailableUntil,
          lastMaintenanceAt: formData.lastMaintenanceAt,
        },
      };

      const response = await apiController.put(
        `/admin/vehicles/${formData.id}`,
        updateVehicleData
      );

      if (response.status === 200) {
        closeEditVehicleModal();
        // Refresh the list
        fetchAmbulances();
        // If the vehicle details modal was open, refresh that data
        if (selectedVehicle && selectedVehicle.id === formData.id) {
          setSelectedVehicle(response.data);
        }
      }
    } catch (err: any) {
      console.error("Failed to update vehicle:", err);
      // Use the specific error state
      setEditError(
        err.response?.data?.message ||
          "Failed to update vehicle. Please try again."
      );
    } finally {
      setIsEditLoading(false); // Use edit-specific loading state
    }
  };

  // Function to fetch ambulances with pagination and filters
  const fetchAmbulances = async (
    page = currentPage,
    limit = itemsPerPage,
    query = searchTerm,
    city = selectedCity,
    status = selectedStatus
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (query) {
        params.append("query", query);
      }

      if (city) {
        params.append("city", city);
      }

      if (status) {
        params.append("status", status);
      }

      // Make API request with query params
      const response = await apiController.get(
        `/admin/vehicles?${params.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = response.data;
      console.log("API response:", data);

      // Update states with response data
      setAmbulances(data.vehicles || []);
      setTotalVehicles(data.totalVehicles || 0);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setAvailableCities(data.stationCities || []);
    } catch (err) {
      console.error("Failed to fetch ambulances:", err);
      setError("Failed to load emergency vehicles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to search stations based on query
  const searchStations = async (query: string) => {
    try {
      setIsSearchingStations(true);
      const params = new URLSearchParams();
      params.append("limit", "10");

      if (query) {
        params.append("query", query);
      }

      const response = await apiController.get(
        `/admin/stations?${params.toString()}`
      );
      if (response.status === 200) {
        setStationSearchResults(response.data.stations || []);
      }
    } catch (err) {
      console.error("Error searching stations:", err);
      setStationSearchResults([]);
    } finally {
      setIsSearchingStations(false);
    }
  };

  // Add this effect for debounced station search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (stationSearchTerm.trim()) {
        searchStations(stationSearchTerm);
      } else {
        setStationSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [stationSearchTerm]);

  // Function to handle station selection
  const handleStationSelect = (station: {
    id: number;
    name: string;
    city: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      assignedToId: station.id,
    }));
    setStationSearchTerm(`${station.name}, ${station.city}`);
    setShowStationDropdown(false);
  };

  // Function to handle clicks outside the station dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#stationSearchContainer")) {
        setShowStationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initial data load
  useEffect(() => {
    fetchAmbulances();
  }, []);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAmbulances(
        1,
        itemsPerPage,
        searchTerm,
        selectedCity,
        selectedStatus
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle city filter change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    fetchAmbulances(1, itemsPerPage, searchTerm, city, selectedStatus);
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    fetchAmbulances(1, itemsPerPage, searchTerm, selectedCity, status);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedStatus("");
    fetchAmbulances(1, itemsPerPage, "", "", "");
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAmbulances(
      page,
      itemsPerPage,
      searchTerm,
      selectedCity,
      selectedStatus
    );
  };

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = Number(e.target.value);
    setItemsPerPage(newLimit);
    // Reset to first page when changing items per page
    fetchAmbulances(1, newLimit, searchTerm, selectedCity, selectedStatus);
  };

  const toSentenceCase = (str: string) => {
    if (!str) return "";
    const chunks = str.split("_").map((chunk) => chunk.trim());
    const capitalizedChunks = chunks.map((chunk) => {
      return chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase();
    });
    return capitalizedChunks.join(" ");
  };

  // Function to generate the pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3; // Number of pages to show around current page

    // Always show first page
    items.push(
      <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(1)}>
          1
        </button>
      </li>
    );

    // Calculate start and end pages to show around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Add pages between start and end
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        // Skip first and last pages as they're added separately
        items.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <li
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return items;
  };

  // Function to handle opening the details modal
  const openVehicleDetails = (vehicle: Ambulance) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  // Function to handle closing the details modal
  const closeVehicleDetails = () => {
    setShowDetailsModal(false);
    // Optional: clear the selected vehicle after a delay
    setTimeout(() => setSelectedVehicle(null), 200);
  };

  return (
    <div className="container mt-4">
      {/* Page heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Emergency Vehicles</h2>
        {userRole === "admin" && (
          <button className="btn btn-primary" onClick={openAddVehicleModal}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Vehicle
          </button>
        )}
      </div>

      <div className="row mb-3">
        {/* Search Input - Increased width */}
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by plate number or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* City filter dropdown - Same width */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedCity}
            onChange={handleCityChange}
            aria-label="Filter by city"
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter dropdown - Reduced width */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={handleStatusChange}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alternative design for Clear filters button */}
        <div className="col-md-1">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary w-100 position-relative"
              onClick={clearFilters}
              disabled={!searchTerm && !selectedCity && !selectedStatus}
              title="Clear all filters"
            >
              <i className="bi bi-funnel"></i>
              {(searchTerm || selectedCity || selectedStatus) && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  <i className="bi bi-x-circle"></i>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results count and pagination info */}
      {!isLoading && !error && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            Showing {ambulances.length} of {totalVehicles} vehicles
          </small>
          <small className="text-muted">
            Page {currentPage} of {totalPages}
            {itemsPerPage < totalVehicles && ` • ${itemsPerPage} per page`}
          </small>
        </div>
      )}

      {/* Create a consistent container for loading and error states */}
      {(isLoading || error) && (
        <div
          className="d-flex justify-content-center align-items-center bg-light rounded shadow-sm"
          style={{
            minHeight: "60vh",
            margin: "20px 0 40px 0",
            padding: "20px",
          }}
        >
          {/* Loading indicator - centered vertically and horizontally */}
          {isLoading && (
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3 mx-auto d-block"
                role="status"
                style={{ width: "3.5rem", height: "3.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted fs-5">Loading vehicles...</div>
            </div>
          )}

          {/* Enhanced error message */}
          {error && (
            <div className="text-center py-5 w-100">
              <div className="mb-4">
                <i
                  className="bi bi-exclamation-circle text-danger"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h4 className="mb-3">Unable to Load Vehicles</h4>
              <p className="text-muted mb-4 w-75 mx-auto">{error}</p>
              <button
                className="btn btn-primary px-4 py-2"
                onClick={() =>
                  fetchAmbulances(
                    currentPage,
                    itemsPerPage,
                    searchTerm,
                    selectedCity,
                    selectedStatus
                  )
                }
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Displaying ambulances in grid - only when not loading and no error */}
      {!isLoading && !error && (
        <div className="row">
          {ambulances.length > 0 ? (
            ambulances.map((vehicle) => {
              // Map statuses to colors and icons
              const statusConfig = {
                AVAILABLE: {
                  color: "success",
                  icon: "check-circle-fill",
                  label: "Available",
                },
                UNAVAILABLE_TEMPORARILY: {
                  color: "warning",
                  icon: "exclamation-triangle-fill",
                  label: "Temporarily Unavailable",
                },
                DISPATCHED: {
                  color: "primary",
                  icon: "truck",
                  label: "Dispatched",
                },
                UNDER_MAINTENANCE: {
                  color: "info",
                  icon: "tools",
                  label: "Under Maintenance",
                },
                OUT_OF_SERVICE: {
                  color: "danger",
                  icon: "x-circle-fill",
                  label: "Out of Service",
                },
              };

              // Get config for current status or use a default
              const status = vehicle?.status || "UNAVAILABLE_TEMPORARILY";
              const config = statusConfig[
                status as keyof typeof statusConfig
              ] || {
                color: "secondary",
                icon: "question-circle",
                label: toSentenceCase(status),
              };

              return (
                <div key={vehicle.id} className="col-lg-4 col-md-6 mb-3">
                  <div
                    className={`card h-100 shadow-sm border-${config.color} border-opacity-25`}
                  >
                    <div
                      className={`card-header bg-${config.color} bg-opacity-10 d-flex justify-content-between align-items-center`}
                    >
                      <h5 className="card-title mb-0 text-truncate">
                        {vehicle?.plateNumber}
                      </h5>
                      <span
                        className={`badge bg-${config.color} d-flex align-items-center`}
                      >
                        <i className={`bi bi-${config.icon} me-1`}></i>
                        {config.label}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-1">
                          <i
                            className={`bi bi-${getVehicleTypeIcon(
                              vehicle?.type
                            )} text-muted`}
                          ></i>
                        </div>
                        <div className="col-11">
                          <strong>Type:</strong> {toSentenceCase(vehicle?.type)}
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-1">
                          <i className="bi bi-geo-alt text-muted"></i>
                        </div>
                        <div className="col-11">
                          <strong>Station:</strong>{" "}
                          {vehicle?.assignedTo?.city
                            ? `${vehicle.assignedTo.name}, ${vehicle.assignedTo.city}`
                            : "Not assigned"}
                        </div>
                      </div>

                      {vehicle?.assignedTo?.name && (
                        <div className="row mb-2">
                          <div className="col-1">
                            <i className="bi bi-telephone-fill text-muted"></i>
                          </div>
                          <div className="col-11">
                            <strong>Contact:</strong>{" "}
                            {vehicle.assignedTo.phone || "N/A"}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openVehicleDetails(vehicle)}
                        >
                          <i className="bi bi-info-circle me-1"></i>
                          Details
                        </button>
                        {userRole === "admin" && (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditVehicleModal(vehicle)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 py-5 text-center">
              <div className="d-inline-block p-4 rounded-circle bg-light mb-3">
                <i className="bi bi-search fs-1 text-muted"></i>
              </div>
              <h4 className="text-muted">No vehicles found</h4>
              <p className="text-muted">
                Try adjusting your search or filter criteria
              </p>
              {(searchTerm || selectedCity || selectedStatus) && (
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination controls with items per page selector */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-4">
          {/* Items per page selector */}
          <div className="d-flex align-items-center">
            <span className="me-2 text-muted">Items per page:</span>
            <select
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              aria-label="Items per page"
              style={{ width: "auto" }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {renderPaginationItems()}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div
          className={`modal fade ${showDetailsModal ? "show" : ""}`}
          style={{ display: showDetailsModal ? "block" : "none" }}
          tabIndex={-1}
          aria-labelledby="vehicleDetailsModal"
          aria-hidden={!showDetailsModal}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="vehicleDetailsModalLabel">
                  Vehicle Details: {selectedVehicle.plateNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeVehicleDetails}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6>Basic Information</h6>
                      <hr />
                      <div className="row mb-2">
                        <div className="col-5 text-muted">
                          Registration Number:
                        </div>
                        <div className="col-7">
                          {selectedVehicle.plateNumber}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-5 text-muted">Vehicle Type:</div>
                        <div className="col-7">
                          <i
                            className={`bi bi-${getVehicleTypeIcon(
                              selectedVehicle.type
                            )} me-2`}
                          ></i>
                          {toSentenceCase(selectedVehicle.type)}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-5 text-muted">Status:</div>
                        <div className="col-7">
                          <span
                            className={`badge bg-${
                              selectedVehicle.status === "AVAILABLE"
                                ? "success"
                                : selectedVehicle.status === "DISPATCHED"
                                ? "primary"
                                : selectedVehicle.status === "UNDER_MAINTENANCE"
                                ? "info"
                                : selectedVehicle.status === "OUT_OF_SERVICE"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {toSentenceCase(selectedVehicle.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6>Assignment Details</h6>
                      <hr />
                      {selectedVehicle.assignedTo ? (
                        <>
                          <div className="row mb-2">
                            <div className="col-5 text-muted">Assigned To:</div>
                            <div className="col-7">
                              {selectedVehicle.assignedTo.name}
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-5 text-muted">
                              Station City:
                            </div>
                            <div className="col-7">
                              {selectedVehicle.assignedTo.city}
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-5 text-muted">Contact:</div>
                            <div className="col-7">
                              {selectedVehicle.assignedTo.phone || "N/A"}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted">Not currently assigned</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <h6>Additional Information</h6>
                    <hr />
                    <div className="row mb-2">
                      <div className="col-3 text-muted">Last Updated:</div>
                      <div className="col-9">
                        {selectedVehicle.updatedAt
                          ? new Date(selectedVehicle.updatedAt).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-3 text-muted">Added On:</div>
                      <div className="col-9">
                        {selectedVehicle.createdAt
                          ? new Date(selectedVehicle.createdAt).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeVehicleDetails}
                >
                  Close
                </button>
                {userRole === "admin" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      closeVehicleDetails();
                      if (selectedVehicle) {
                        openEditVehicleModal(selectedVehicle);
                      }
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit Vehicle
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
          aria-labelledby="addVehicleModal"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Vehicle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddVehicleModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleAddVehicle}>
                <div className="modal-body">
                  {addError && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {addError}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="plateNumber" className="form-label">
                        Plate Number*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="plateNumber"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="model" className="form-label">
                        Model*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="modelYear" className="form-label">
                        Model Year*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="modelYear"
                        name="modelYear"
                        value={formData.modelYear}
                        onChange={handleFormChange}
                        required
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="capacity" className="form-label">
                        Capacity*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleFormChange}
                        required
                        min="1"
                        max="20"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="type" className="form-label">
                        Vehicle Type*
                      </label>
                      <select
                        className="form-select"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="AMBULANCE">Ambulance</option>
                        <option value="FIRST_RESPONDER">First Responder</option>
                        <option value="FIRE_TRUCK">Fire Truck</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="stationSearch" className="form-label">
                        Assigned Station*
                      </label>
                      <div
                        className="position-relative"
                        id="stationSearchContainer"
                      >
                        <input
                          type="text"
                          className="form-control"
                          id="stationSearch"
                          placeholder="Search for stations..."
                          value={stationSearchTerm}
                          onChange={(e) => {
                            setStationSearchTerm(e.target.value);
                            setShowStationDropdown(true);
                          }}
                          onFocus={() => setShowStationDropdown(true)}
                          required={!formData.assignedToId}
                        />
                        {showStationDropdown && (
                          <div
                            className="dropdown-menu position-absolute w-100 show"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {isSearchingStations ? (
                              <div className="dropdown-item text-center">
                                <div
                                  className="spinner-border spinner-border-sm text-primary me-2"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                                Searching...
                              </div>
                            ) : stationSearchResults.length > 0 ? (
                              stationSearchResults.map((station) => (
                                <button
                                  type="button"
                                  key={station.id}
                                  className="dropdown-item d-flex justify-content-between align-items-center"
                                  onClick={() => handleStationSelect(station)}
                                >
                                  <span>{station.name}</span>
                                  <small className="text-muted">
                                    {station.city}
                                  </small>
                                </button>
                              ))
                            ) : stationSearchTerm.trim() ? (
                              <div className="dropdown-item text-center text-muted">
                                <i className="bi bi-info-circle me-2"></i>
                                No stations found
                              </div>
                            ) : (
                              <div className="dropdown-item text-center text-muted">
                                Type to search stations
                              </div>
                            )}
                          </div>
                        )}
                        {formData.assignedToId ? (
                          <div className="form-text text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Station selected
                          </div>
                        ) : (
                          <div className="form-text text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Start typing to search stations
                          </div>
                        )}
                        <input
                          type="hidden"
                          name="assignedToId"
                          value={formData.assignedToId || ""}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeAddVehicleModal}
                    disabled={isAddLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isAddLoading}
                  >
                    {isAddLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      "Add Vehicle"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
          aria-labelledby="editVehicleModal"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit Vehicle: {formData.plateNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditVehicleModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleEditVehicle}>
                <div className="modal-body">
                  {editError && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {editError}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="editPlateNumber" className="form-label">
                        Plate Number*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editPlateNumber"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="editModel" className="form-label">
                        Model*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editModel"
                        name="model"
                        value={formData.model}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="editModelYear" className="form-label">
                        Model Year*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="editModelYear"
                        name="modelYear"
                        value={formData.modelYear}
                        onChange={handleFormChange}
                        required
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="editCapacity" className="form-label">
                        Capacity*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="editCapacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleFormChange}
                        required
                        min="1"
                        max="20"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="editType" className="form-label">
                        Vehicle Type*
                      </label>
                      <select
                        className="form-select"
                        id="editType"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="AMBULANCE">Ambulance</option>
                        <option value="FIRST_RESPONDER">First Responder</option>
                        <option value="FIRE_TRUCK">Fire Truck</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="editStatus" className="form-label">
                        Status*
                      </label>
                      <select
                        className="form-select"
                        id="editStatus"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="UNAVAILABLE_TEMPORARILY">
                          Temporarily Unavailable
                        </option>
                        <option value="UNDER_MAINTENANCE">
                          Under Maintenance
                        </option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="editStationSearch" className="form-label">
                        Assigned Station*
                      </label>
                      <div
                        className="position-relative"
                        id="stationSearchContainer"
                      >
                        <input
                          type="text"
                          className="form-control"
                          id="editStationSearch"
                          placeholder="Search for stations..."
                          value={stationSearchTerm}
                          onChange={(e) => {
                            setStationSearchTerm(e.target.value);
                            setShowStationDropdown(true);
                          }}
                          onFocus={() => setShowStationDropdown(true)}
                          required={!formData.assignedToId}
                        />
                        {showStationDropdown && (
                          <div
                            className="dropdown-menu position-absolute w-100 show"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {isSearchingStations ? (
                              <div className="dropdown-item text-center">
                                <div
                                  className="spinner-border spinner-border-sm text-primary me-2"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                                Searching...
                              </div>
                            ) : stationSearchResults.length > 0 ? (
                              stationSearchResults.map((station) => (
                                <button
                                  type="button"
                                  key={station.id}
                                  className="dropdown-item d-flex justify-content-between align-items-center"
                                  onClick={() => handleStationSelect(station)}
                                >
                                  <span>{station.name}</span>
                                  <small className="text-muted">
                                    {station.city}
                                  </small>
                                </button>
                              ))
                            ) : stationSearchTerm.trim() ? (
                              <div className="dropdown-item text-center text-muted">
                                <i className="bi bi-info-circle me-2"></i>
                                No stations found
                              </div>
                            ) : (
                              <div className="dropdown-item text-center text-muted">
                                Type to search stations
                              </div>
                            )}
                          </div>
                        )}
                        {formData.assignedToId ? (
                          <div className="form-text text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Station selected
                          </div>
                        ) : (
                          <div className="form-text text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Start typing to search stations
                          </div>
                        )}
                        <input
                          type="hidden"
                          name="assignedToId"
                          value={formData.assignedToId || ""}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditVehicleModal}
                    disabled={isEditLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isEditLoading}
                  >
                    {isEditLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add backdrop for modals */}
      {(showAddModal || showEditModal || showDetailsModal) && (
        <div
          className="modal-backdrop fade show"
          onClick={
            showAddModal
              ? closeAddVehicleModal
              : showEditModal
              ? closeEditVehicleModal
              : closeVehicleDetails
          }
        ></div>
      )}
    </div>
  );
};

export default AmbulancesScreen;
