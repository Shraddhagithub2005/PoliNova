import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function FIRList() {
  const [firData, setFirData] = useState([]);

  // ✅ Fetch complaints from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/victim/complaint/list/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Complaints:", data);
        setFirData(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="container mt-5 mb-5" style={{ width: "80%" }}>
      <h4 className="text-center text-danger mb-5 fw-bold">
        FIR Complaint List
      </h4>

      <table className="table table-bordered text-center align-middle shadow-sm">
        <thead className="table-danger">
          <tr>
            <th>Sr. No.</th>
            <th>Complaint ID</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {firData.length === 0 ? (
            <tr>
              <td colSpan="5">No complaints found</td>
            </tr>
          ) : (
            firData.map((fir, index) => (
              <tr key={fir.complaint_id}>
                <td>{index + 1}</td>
                <td>{fir.complaint_id}</td>
                <td>{fir.category}</td>
                <td>{fir.date}</td>

                <td>
                  <button className="btn btn-success btn-sm me-2">
                    Accept
                  </button>
                  <button className="btn btn-danger btn-sm">
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FIRList;