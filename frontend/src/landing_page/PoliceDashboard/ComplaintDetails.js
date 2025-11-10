import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ComplaintDetails() {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/victim/complaint/detail/${complaint_id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch complaint details");
        return res.json();
      })
      .then((data) => setComplaint(data))
      .catch((err) => {
        console.error("❌ Error fetching complaint:", err);
        setError("Failed to load complaint details.");
      });
  }, [complaint_id]);

  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  if (!complaint)
    return <div className="text-center mt-5 text-muted">Loading complaint details...</div>;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <div className="card shadow-lg">
        <div className="card-header bg-danger text-white fw-bold fs-5">
          Complaint Details — {complaint.complaint_id}
        </div>
        <div className="card-body">
          <h5 className="mb-3 text-primary">{complaint.category}</h5>

          <div className="mb-3">
            <strong>Date of Incident:</strong> {complaint.date || "N/A"}
          </div>
          <div className="mb-3">
            <strong>Time:</strong> {complaint.time || "N/A"}
          </div>
          <div className="mb-3">
            <strong>Location:</strong> {complaint.location}
          </div>
          <div className="mb-3">
            <strong>Delay in Reporting:</strong> {complaint.delay}
          </div>

          <div className="mb-4">
            <strong>Description:</strong>
            <p className="border rounded p-3 bg-light mt-2">{complaint.description}</p>
          </div>

          <hr />
          <h6 className="fw-bold text-danger">Victim Information</h6>
          <div className="mb-2"><strong>Name:</strong> {complaint.victim_name || "N/A"}</div>
          <div className="mb-2"><strong>Email:</strong> {complaint.victim_email}</div>
          <div className="mb-2"><strong>Phone:</strong> {complaint.victim_phone || "N/A"}</div>
          <div className="mb-3"><strong>Address:</strong> {complaint.victim_address || "N/A"}</div>

          <div className="text-center">
            <button
              className="btn btn-secondary mt-3"
              onClick={() => navigate(-1)}
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
