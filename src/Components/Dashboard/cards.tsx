import { FaAmbulance, FaUsers, FaExclamationTriangle } from "react-icons/fa"

interface CardsProps {
  isLoading: boolean
  usersCount: string | null
  activeAmbulanceCount: string | null
  pendingRequestsCount: string | null
}

const Cards = ({
  usersCount,
  isLoading,
  activeAmbulanceCount,
  pendingRequestsCount
}: CardsProps) => {
  return (
    <div className="row text-white mb-4">
      <div className="col-md-4 mb-3">
        <div className="card bg-primary shadow-lg p-3">
          <FaAmbulance size={30} className="me-2 text-white" />
          <h5 className="text-white">
            Active Ambulances:{" "}
            {isLoading && activeAmbulanceCount === null ? (
              <div className="d-inline-block ms-2">
                <div
                  className="spinner-border spinner-border-sm text-white"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              activeAmbulanceCount
            )}
          </h5>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-success shadow-lg p-3">
          <FaUsers size={30} className="me-2 text-white" />
          <h5 className="text-white">
            Total Users:{" "}
            {isLoading && usersCount === null ? (
              <div className="d-inline-block ms-2">
                <div
                  className="spinner-border spinner-border-sm text-white"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              usersCount
            )}
          </h5>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-danger shadow-lg p-3">
          <FaExclamationTriangle size={30} className="me-2 text-white" />
          <h5 className="text-white">
            Pending Requests:{" "}
            {isLoading && pendingRequestsCount === null ? (
              <div className="d-inline-block ms-2">
                <div
                  className="spinner-border spinner-border-sm text-white"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              pendingRequestsCount
            )}
          </h5>
        </div>
      </div>
    </div>
  )
}

export default Cards
