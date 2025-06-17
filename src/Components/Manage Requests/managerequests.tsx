import React, { useState, useEffect } from "react";
import { HelpRequest } from "../../schemas/requests";
import ReviewRequestMap from "./ReviewRequestMap";
import { apiSocket, apiSocketAuthUserId } from "../../api/apiController";
const requests: HelpRequest[] = [
  {
    id: 1,
    patient: "Ali Khan",
    location: "RCET, Grw",
    status: "Pending",
    type: "Bike",
    driver: "Kashif Hussain",
    driverContact: "0300-4424987",
    distance: "400m",
    lat: 32.1877,
    lng: 74.1945, // Fazal Town, Gujranwala
  },
  {
    id: 2,
    patient: "Sara Ahmed",
    location: "Karachi",
    status: "Completed",
    type: "Van",
  },
  {
    id: 3,
    patient: "Sara Ahmed",
    location: "Garden Town",
    status: "Pending",
    type: "Ambulance",
    driver: "Imran Qureshi",
    driverContact: "0321-5566778",
    distance: "2.5km",
    lat: 32.1682,
    lng: 74.2137, // Garden Town, Gujranwala
  },
  {
    id: 4,
    patient: "Bilal Raza",
    location: "SITE Area",
    status: "Pending",
    type: "Fire Brigade",
    driver: "Asad Mehmood",
    driverContact: "0333-9988776",
    distance: "3km",
    lat: 32.1565,
    lng: 74.1871, // SITE Area, Gujranwala
  },
  {
    id: 5,
    patient: "Hassan Riaz",
    location: "City Housing",
    status: "Pending",
    type: "Bike",
    driver: "Faisal Javed",
    driverContact: "0301-1122334",
    distance: "5km",
    lat: 32.21,
    lng: 74.18, // City Housing, Gujranwala
  },
  {
    id: 6,
    patient: "Zainab Gul",
    location: "Rawalpindi",
    status: "Completed",
    type: "Van",
  },
  {
    id: 7,
    patient: "Hamza Tariq",
    location: "Multan",
    status: "Completed",
    type: "Bike",
    driver: "Noman Akhtar",
    driverContact: "0345-2233445",
  },
  {
    id: 8,
    patient: "Farhan Ali",
    location: "Peshawar",
    status: "Completed",
    type: "Van",
    driver: "Sajid Khan",
    driverContact: "0312-3344556",
  },
  {
    id: 9,
    patient: "Ayesha Noor",
    location: "Quetta",
    status: "Completed",
    type: "Fire Brigade",
  },
  {
    id: 10,
    patient: "Saad Mahmood",
    location: "Lahore",
    status: "Completed",
    type: "Bike",
    driver: "Rashid Latif",
    driverContact: "0302-4455667",
  },
  {
    id: 11,
    patient: "Rehan Siddiqui",
    location: "Hyderabad",
    status: "Completed",
    type: "Van",
    driver: "Zeeshan Ali",
    driverContact: "0331-7788990",
  },
  {
    id: 12,
    patient: "Nadia Khan",
    location: "Sialkot",
    status: "Completed",
    type: "Bike",
  },
  {
    id: 13,
    patient: "Usman Ghani",
    location: "Gujranwala",
    status: "Completed",
    type: "Van",
    driver: "Adnan Bashir",
    driverContact: "0346-8899001",
  },
  {
    id: 14,
    patient: "Tariq Mehmood",
    location: "Sargodha",
    status: "Completed",
    type: "Fire Brigade",
    driver: "Shahid Nawaz",
    driverContact: "0304-5566778",
  },
  {
    id: 15,
    patient: "Fatima Baig",
    location: "Bahawalpur",
    status: "Completed",
    type: "Bike",
    driver: "Waseem Raza",
    driverContact: "0322-6677889",
  },
  {
    id: 16,
    patient: "Shahzad Alam",
    location: "Sukkur",
    status: "Completed",
    type: "Van",
  },
  {
    id: 17,
    patient: "Maira Javed",
    location: "Mardan",
    status: "Completed",
    type: "Fire Brigade",
    driver: "Kamran Yousaf",
    driverContact: "0313-2233445",
  },
  {
    id: 18,
    patient: "Danish Ahmed",
    location: "Abbottabad",
    status: "Completed",
    type: "Van",
    driver: "Furqan Saleem",
    driverContact: "0347-1122334",
  },
  {
    id: 19,
    patient: "Rabia Malik",
    location: "Larkana",
    status: "Completed",
    type: "Bike",
  },
  {
    id: 20,
    patient: "Waleed Akram",
    location: "Gujrat",
    status: "Completed",
    type: "Bike",
    driver: "Adeel Shabbir",
    driverContact: "0305-3344556",
  },
];

export default function ManageRequests() {
  const [requestList, setRequestList] = useState(requests);
  const [showReview, setShowReview] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewTimers, setReviewTimers] = useState<{ [id: string]: number }>(
    {}
  );
  const [reviewDisabled, setReviewDisabled] = useState<{
    [id: string]: boolean;
  }>({});

  useEffect(() => {
    const handleNewRequest = (newRequest: {
      emergency: {
        id: string;
        locationName: string;
        reporter: { firstName: string };
        ambulance: { type: string; driver: { name: string; phone: string; id: number; } };
        distance: number;
        reportLatitude: number;
        reportLongitude: number;
        requestReceivedAt: string;
        requestApprovalCounterExpiresAt: string;
      };
    }) => {
      console.log("New request received:", newRequest);
      setRequestList((prevRequests) => [
        ...prevRequests,
        {
          id: newRequest?.emergency?.id,
          location: newRequest?.emergency?.locationName,
          patient: newRequest?.emergency?.reporter?.firstName,
          type: newRequest?.emergency?.ambulance?.type,
          driver: newRequest?.emergency?.ambulance?.driver?.name,
          driverId: newRequest?.emergency?.ambulance?.driver?.id,
          driverContact: newRequest?.emergency?.ambulance?.driver?.phone,
          distance: newRequest?.emergency?.distance,
          lat: newRequest?.emergency?.reportLatitude,
          lng: newRequest?.emergency?.reportLongitude,
          reportedAt: new Date(newRequest?.emergency?.requestReceivedAt),
          approvalCounterExpiresAt: new Date(
            newRequest?.emergency?.requestApprovalCounterExpiresAt
          ),
          status: "Pending",
        },
      ]);
      setCount((prevCount) => prevCount + 1);
    };

    const handleRequestPickedUp = (requestId: string) => {
      console.log("Request picked up:", requestId);
      console.log("Pending requests before update:", requestList);
      setRequestList((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "Under Review",
              }
            : req
        )
      );
      setReviewTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        updatedTimers[requestId] = 0; // Expire the timer
        return updatedTimers;
      });
      setReviewDisabled((prevDisabled) => {
        const updatedDisabled = { ...prevDisabled };
        updatedDisabled[requestId] = true; // Disble the review button
        return updatedDisabled;
      });
    };

    const socket = apiSocket.connect();
    socket.on("emergencyReported", handleNewRequest);
    socket.on("requestPickedUp", handleRequestPickedUp);

    return () => {
      socket.off("emergencyReported", handleNewRequest);
      socket.off("requestPickedUp", handleRequestPickedUp);
      socket.disconnect?.(); // Only if your socket supports disconnect
    };
  }, []);

  useEffect(() => {
    setCount(requestList.filter((req) => req.status === "Pending").length);
  }, [requestList]);

  useEffect(() => {
    const timers: { [id: string]: number } = {};
    const disabled: { [id: string]: boolean } = {};

    requestList.forEach((req) => {
      if (req.status === "Pending") {
        if (
          req.approvalCounterExpiresAt instanceof Date &&
          !isNaN(req.approvalCounterExpiresAt.getTime())
        ) {
          const now = new Date();
          const diff = Math.max(
            0,
            Math.floor(
              (req.approvalCounterExpiresAt.getTime() - now.getTime()) / 1000
            )
          );
          timers[req.id] = diff;
          disabled[req.id] = diff <= 0;
        } else {
          timers[req.id] = 0;
          disabled[req.id] = true;
        }
      }
    });

    setReviewTimers(timers);
    setReviewDisabled(disabled);
  }, [requestList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewTimers((prev) => {
        const updated: { [id: string]: number } = {};
        Object.entries(prev).forEach(([id, time]) => {
          updated[id] = Math.max(0, time - 1);
        });
        return updated;
      });
      setReviewDisabled((prev) => {
        const updated: { [id: string]: boolean } = {};
        Object.entries(reviewTimers).forEach(([id, time]) => {
          updated[id] = time <= 1;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reviewTimers]);

  const handleAccept = (id: number) => {
    setRequestList((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: "Completed" } : req
      )
    );
  };

  const handleReview = (req: HelpRequest) => {
    setSelectedRequest(req);
    setShowReview(true);

    // Emit socket event for review using existing connection
    const socket = apiSocket.connect();
    socket.emit("requestUnderReview", {
      requestId: req.id,
      reviewedAt: new Date().toISOString(),
    });

    console.log("Review event emitted for request:", req.id);
  };

  const filteredRequests = requestList.filter(
    (req) =>
      req.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1>Manage Requests</h1>
      <hr />
      <div className="container mt-4">
        <h2 className="text-center mb-3">🚑 Pending Requests</h2>
        <div className="table-responsive mx-auto" style={{ maxWidth: "800px" }}>
          <table className="table table-bordered table-striped shadow-sm rounded">
            <thead className="table-dark text-center">
              <tr>
                <th>Reporter Name</th>
                <th>Suggested Ambulance</th>
                <th>Location</th>
                <th>Distance</th>
                {/* <th>Status</th> */}
                <th>Choose</th>
              </tr>
            </thead>
            <tbody>
              {requestList
                .filter(
                  (req) =>
                    req.status === "Pending" && reviewDisabled[req.id] === false
                )
                .slice(0, 5).length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center text-muted py-4">
                      <span style={{ fontSize: "2rem" }}>🟢</span>
                      <div>No pending requests at the moment.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                requestList
                  .filter(
                    (req) =>
                      req.status === "Pending" &&
                      reviewDisabled[req.id] === false
                  )
                  .slice(0, 5)
                  .map((req) => (
                    <tr key={req?.id} className="align-middle text-center">
                      <td className="fw-bold">{req?.patient}</td>
                      <td className="text-muted">
                        {req?.type}{" "}
                        {req?.driver && req?.driverContact && (
                          <>
                            {" - "}
                            <a href={`tel:${req?.driverContact}`}>
                              {req?.driver} - {req?.driverContact}
                            </a>
                          </>
                        )}
                      </td>
                      <td className="text-muted">{req?.location}</td>
                      <td>{req?.distance}</td>
                      {/* <td
                      className={`fw-bold ${
                        req.status === "Pending"
                          ? "text-warning"
                          : req.status === "Completed"
                          ? "text-success"
                          : "text-primary"
                      }`}
                    >
                      {req.status === "Pending"
                        ? "⏳ Pending"
                        : req.status === "Completed"
                        ? "✅ Completed"
                        : req.status}
                    </td> */}

                      <td>
                        {req?.status === "Pending" ? (
                          <div style={{ position: "relative", width: "110px" }}>
                            <button
                              type="button"
                              className={`btn fw-bold px-3 py-1 shadow-sm me-2 ${
                                reviewDisabled[req.id]
                                  ? "btn-secondary"
                                  : "btn-primary"
                              }`}
                              onClick={() => {
                                handleReview(req);
                                setRequestList((prev) =>
                                  prev.map((r) =>
                                    r.id === req.id
                                      ? { ...r, status: "Completed" }
                                      : r
                                  )
                                );
                              }}
                              disabled={reviewDisabled[req.id]}
                              style={{
                                width: "100%",
                                position: "relative",
                                zIndex: 1,
                                cursor: reviewDisabled[req.id]
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: reviewDisabled[req.id] ? 0.7 : 1,
                              }}
                            >
                              📝 Review
                              {/* No timer text here */}
                            </button>
                            {/* Progress bar at bottom */}
                            {typeof reviewTimers[req.id] === "number" && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  bottom: 0,
                                  height: "4px",
                                  width: `${
                                    req.approvalCounterExpiresAt instanceof
                                      Date && req.reportedAt instanceof Date
                                      ? (reviewTimers[req.id] /
                                          Math.max(
                                            1,
                                            Math.floor(
                                              (req.approvalCounterExpiresAt.getTime() -
                                                req.reportedAt.getTime()) /
                                                1000
                                            )
                                          )) *
                                        100
                                      : 0
                                  }%`,
                                  background: reviewDisabled[req.id]
                                    ? "#ccc"
                                    : "#0d6efd",
                                  transition: "width 1s linear",
                                  borderRadius: "0 0 4px 4px",
                                  zIndex: 2,
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-success fw-bold">
                            ✔ Accepted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-center mt-4">🚑 All Requests </h2>

      <div className="table-responsive mx-auto" style={{ maxWidth: "800px" }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="table table-bordered table-striped shadow-sm rounded">
          <thead className="table-dark">
            <tr>
              <th>Reporter Name</th>
              <th>Ambulance Type</th>
              <th>City</th>
              <th>Distance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="align-middle text-center">
                <td className="fw-bold">{req.patient}</td>
                <td className="text-muted">{req.type}</td>
                <td className="text-muted">{req.location}</td>
                <td>2km</td>
                <td
                  className={`fw-bold ${
                    req.status === "Pending" ? "text-warning" : "text-success"
                  }`}
                >
                  {req.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Popup */}
      {showReview && selectedRequest && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
          }}
        >
          <div
            className="bg-white rounded shadow p-3"
            style={{ minWidth: 350, minHeight: 400, maxWidth: 600 }}
          >
            <h5 className="mb-3">Request Review</h5>
            <ReviewRequestMap
              request={selectedRequest}
              showPopup={setShowReview}
            />
            {/* <div className="text-end mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReview(false)}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
