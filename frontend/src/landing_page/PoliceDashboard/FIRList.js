import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added for navigation
import "bootstrap/dist/css/bootstrap.min.css";

function FIRList() {
  const [firData, setFirData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate hook

  // ✅ Fetch real complaints from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/victim/complaint/list/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch complaints");
        return res.json();
      })
      .then((data) => {
        setFirData(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching complaints:", err);
        setError("Failed to load complaints from server.");
      });
  }, []);

  // ✅ Updated to navigate to a full page instead of showing alert
  const handleViewComplaint = (complaint) => {
    navigate(`/police/complaint/${complaint.complaint_id}`);
  };

  return (
    <div className="container mt-5 mb-5" style={{ width: "85%" }}>
      <h4 className="text-center text-danger mb-5 fw-bold">
        FIR Complaint List
      </h4>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <table className="table table-bordered text-center align-middle shadow-sm">
        <thead className="table-danger">
          <tr>
            <th>Sr. No.</th>
            <th>Complaint ID</th>
            <th>Complaint Title</th>
            <th>Date</th>
            <th>View Complaint</th>
            <th>Accept / Reject</th>
          </tr>
        </thead>
        <tbody>
          {firData.length > 0 ? (
            firData.map((fir, index) => (
              <tr key={fir.complaint_id || index}>
                <td>{index + 1}</td>
                <td>{fir.complaint_id}</td>
                <td>{fir.category}</td>
                <td>{fir.date}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewComplaint(fir)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2">
                    Accept
                  </button>
                  <button className="btn btn-danger btn-sm">Reject</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-muted">
                No complaints available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FIRList;
