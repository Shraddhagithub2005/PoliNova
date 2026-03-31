import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SuspectDetails() {
  const { id: complaint_id } = useParams();
  const navigate = useNavigate(); // ✅ added

  const [suspect, setSuspect] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!complaint_id) return;

    fetch(`http://127.0.0.1:8000/api/suspect/${complaint_id}/`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then(data => {
        console.log("Suspect Data:", data);
        setSuspect(data);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to load suspect details.");
      });
  }, [complaint_id]);

  if (error) {
    return <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>;
  }

  if (!suspect) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="container mt-4">

      {/* ✅ BACK BUTTON */}
      <button
        onClick={() => navigate("/PoliceDashboard/ForensicSketch")}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
          backgroundColor: "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ⬅ Back to List
      </button>

      <div className="card shadow-lg p-4">
        <h3 className="text-center text-danger mb-4">
          Suspect Details (Complaint ID: {complaint_id})
        </h3>

        <div className="row">
          <div className="col-md-6">
            <p><strong>Gender:</strong> {suspect.gender}</p>
            <p><strong>Age:</strong> {suspect.age}</p>
            <p><strong>Face Shape:</strong> {suspect.faceShape}</p>
            <p><strong>Skin Tone:</strong> {suspect.skinTone}</p>
            <p><strong>Forehead:</strong> {suspect.forehead}</p>
          </div>

          <div className="col-md-6">
            <p><strong>Hair Type:</strong> {suspect.hairType}</p>
            <p><strong>Hair Color:</strong> {suspect.hairColor}</p>
            <p><strong>Eye Shape:</strong> {suspect.eyeShape}</p>
            <p><strong>Eye Color:</strong> {suspect.eyeColor}</p>
            <p><strong>Eyebrow:</strong> {suspect.eyebrow}</p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6">
            <p><strong>Nose Size:</strong> {suspect.noseSize}</p>
            <p><strong>Nose Shape:</strong> {suspect.noseShape}</p>
            <p><strong>Lip Type:</strong> {suspect.lipType}</p>
          </div>

          <div className="col-md-6">
            <p><strong>Beard:</strong> {suspect.beard}</p>
            <p><strong>Mustache:</strong> {suspect.mustache}</p>
            <p><strong>Identifiers:</strong> {suspect.identifiers || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuspectDetails;