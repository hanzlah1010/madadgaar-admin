import React, { useState, useEffect } from "react";

interface AccidentDetection {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  status: string;
  mediaUrl: string;
  detectedAt: string;
  liveFeedUrl: string;
}

function generateFakeDetections(count = 5): AccidentDetection[] {
  const locations = [
    { name: "Lahore", lat: 31.5497, lng: 74.3436 },
    { name: "Karachi", lat: 24.8607, lng: 67.0011 },
    { name: "Islamabad", lat: 33.6844, lng: 73.0479 },
    { name: "Multan", lat: 30.1575, lng: 71.5249 },
    { name: "Faisalabad", lat: 31.4504, lng: 73.135 },
  ];

  const images = [
    "https://placekitten.com/200/120",
    "https://placebear.com/200/120",
    "https://dummyimage.com/200x120/ff4444/ffffff.png&text=Crash",
  ];

  const videos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  ];

  const data: AccidentDetection[] = [];

  for (let i = 0; i < count; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const isVideo = Math.random() > 0.5;
    data.push({
      id: `fake-${i + 1}`,
      locationName: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      status: Math.random() > 0.4 ? "Live" : "Closed",
      mediaUrl: isVideo
        ? videos[Math.floor(Math.random() * videos.length)]
        : images[Math.floor(Math.random() * images.length)],
      detectedAt: new Date(Date.now() - Math.random() * 1e7).toISOString(),
      liveFeedUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    });
  }

  return data;
}

export default function AccidentDetections() {
  const [detections, setDetections] = useState<AccidentDetection[]>([]);
  const [selected, setSelected] = useState<AccidentDetection | null>(null);

  useEffect(() => {
    const fake = generateFakeDetections(5);
    setDetections(fake);
  }, []);

  const handleApprove = () => {
  if (!selected) return;
  alert(`✅ Approved accident: ${selected.id}`);
  // Optionally remove approved detection as well
  setDetections((prev) => prev.filter((d) => d.id !== selected.id));
  setSelected(null);
};


  const handleReject = () => {
  if (!selected) return;
  alert(`❌ Rejected accident: ${selected.id}`);
  // Remove the rejected detection from the list
  setDetections((prev) => prev.filter((d) => d.id !== selected.id));
  setSelected(null);
};


  return (
    <div className="p-4">
      <h2 className="text-center mb-4">🚨 AI Accident Detections</h2>
      <div className="table-responsive mx-auto" style={{ maxWidth: 1100 }}>
        <table className="table table-bordered table-striped shadow-sm rounded">
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Timestamp</th>
              <th>Snapshot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {detections.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No detections so far.
                </td>
              </tr>
            ) : (
              detections.map((d) => (
                <tr key={d.id} className="align-middle text-center">
                  <td>{d.id}</td>
                  <td>{d.locationName}</td>
                  <td>{new Date(d.detectedAt).toLocaleString()}</td>
                  <td>
                    {d.mediaUrl.endsWith(".mp4") ? (
                      <video width={120} controls muted preload="metadata">
                        <source src={d.mediaUrl} type="video/mp4" />
                        Your browser doesn't support video.
                      </video>
                    ) : (
                      <img
                        src={d.mediaUrl}
                        alt="snapshot"
                        style={{ width: 120, maxHeight: 90, objectFit: "cover", borderRadius: 4 }}
                      />
                    )}
                  </td>
                  <td className={`fw-bold ${d.status === "Live" ? "text-danger" : "text-success"}`}>
                    {d.status}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelected(d)}
                    >
                      🔍 Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow-lg d-flex flex-column"
            style={{ width: "80%", height: "80%", overflow: "auto" }}
          >
            <h5 className="text-center mb-3">🚑 Accident Review: {selected.id}</h5>
            <div className="d-flex gap-3 flex-wrap" style={{ flex: 1 }}>
              {/* Left - Media */}
              <div style={{ flex: 1 }}>
                <h1>Live Footage</h1>
                {selected.mediaUrl.endsWith(".mp4") ? (
                  <video width="100%" controls muted>
                    <source src={selected.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={selected.mediaUrl}
                    alt="snapshot"
                    className="img-fluid rounded"
                    style={{ maxHeight: 300, objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Right - Live Feed */}

              <div style={{ flex: 1 }}>
                <h1>Detected Footage</h1>
                <iframe
                  title="Live Feed"
                  src={selected.liveFeedUrl}
                  style={{ width: "100%", height: 300, borderRadius: 6 }}
                  allow="autoplay"
                />
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-3">
              <p>
                <strong>Location:</strong> {selected.locationName}
              </p>
              <p>
                <strong>Detected At:</strong>{" "}
                {new Date(selected.detectedAt).toLocaleString()}
              </p>
            </div>

            {/* Approve/Reject Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-auto">
              <button className="btn btn-outline-danger" onClick={handleReject}>
                ❌ Reject
              </button>
              <button className="btn btn-success" onClick={handleApprove}>
                ✅ Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
