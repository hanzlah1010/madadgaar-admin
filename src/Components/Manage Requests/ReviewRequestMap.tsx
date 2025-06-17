import React, { useCallback, useEffect, useState, useRef } from "react";
import { HelpRequest } from "../../schemas/requests";
import { apiSocket } from "../../api/apiController";

// Function to generate ambulances with one at the exact request distance
function generateAmbulances(
  center: { lat: number; lng: number },
  count = 3,
  requestDistance: string
) {
  const ambulances = [];

  // Parse the distance from the request (e.g., "900m" or "2.5km")
  let exactDistance = 3; // Default if parsing fails

  if (requestDistance) {
    if (requestDistance.endsWith("km")) {
      exactDistance = parseFloat(requestDistance.replace("km", ""));
    } else if (requestDistance.endsWith("m")) {
      exactDistance = parseFloat(requestDistance.replace("m", "")) / 1000; // Convert meters to km
    }
  }

  // First ambulance at exact distance from request
  const exactAngle = Math.random() * 2 * Math.PI;
  const dLatExact = (exactDistance / 111) * Math.cos(exactAngle);
  const dLngExact =
    (exactDistance / (111 * Math.cos(center.lat * (Math.PI / 180)))) *
    Math.sin(exactAngle);

  ambulances.push({
    lat: center.lat + dLatExact,
    lng: center.lng + dLngExact,
    id: 1,
    isMatchingRequestDistance: true,
  });

  // Add remaining ambulances
  for (let i = 1; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 2 + Math.random() * 3; // Random distance between 2-5km
    const dLat = (distance / 111) * Math.cos(angle);
    const dLng =
      (distance / (111 * Math.cos(center.lat * (Math.PI / 180)))) *
      Math.sin(angle);

    ambulances.push({
      lat: center.lat + dLat,
      lng: center.lng + dLng,
      id: i + 1,
      isMatchingRequestDistance: false,
    });
  }

  return ambulances;
}

const defaultLatLng = { lat: 32.1877, lng: 74.1945 };

const ReviewRequestMap = ({
  request,
  showPopup,
}: {
  request: HelpRequest;
  showPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Get reporter location
  const reporterLatLng =
    request?.lat && request?.lng
      ? { lat: Number(request.lat), lng: Number(request.lng) }
      : defaultLatLng;

  // Generate ambulances once with one at the exact distance
  const ambulances = useRef(
    generateAmbulances(
      reporterLatLng,
      2 + Math.floor(Math.random() * 3),
      typeof request?.distance === "number"
        ? `${request.distance}km`
        : request?.distance || "3km"
    )
  ).current;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Maps API loaded");
      if (!mapRef.current) return;

      // Create map
      const googleMap = new google.maps.Map(mapRef.current, {
        center: reporterLatLng,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(googleMap);

      // Add reporter marker (red)
      const reporterMarker = new google.maps.Marker({
        position: reporterLatLng,
        map: googleMap,
        title: "Reporter Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

      // Add ambulance markers (green for exact distance, grey for others)
      const ambulanceMarkers = ambulances.map(
        (amb) =>
          new google.maps.Marker({
            position: { lat: amb.lat, lng: amb.lng },
            map: googleMap,
            title: amb.isMatchingRequestDistance
              ? `Ambulance #${amb.id} (${request?.distance} away)`
              : `Ambulance #${amb.id}`,
            icon: amb.isMatchingRequestDistance
              ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          })
      );

      setMarkers([reporterMarker, ...ambulanceMarkers]);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      markers.forEach((marker) => marker.setMap(null));
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="map-container">
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <div className="mt-2 small text-muted">
        <p>
          Nearest ambulance is {request?.distance} away, with{" "}
          {ambulances.length - 1} other ambulances available
        </p>
      </div>

      {/* Action buttons */}
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => console.log("Edit clicked")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-square me-1"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
            />
          </svg>
          Edit
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            apiSocket.emit("suggestionApproved", {
              emergencyId: request.id,
              driverId: request.driverId,
              approvedAt: new Date().toISOString(),
            });
            console.log("Accept clicked");
            console.log("Request accepted:", request.id);
            console.log("Driver ID:", request.driverId);
            showPopup(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-check-circle me-1"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
          </svg>
          Accept
        </button>
      </div>
    </div>
  );
};

export default ReviewRequestMap;

