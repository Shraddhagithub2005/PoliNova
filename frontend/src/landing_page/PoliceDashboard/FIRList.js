import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchComplaints, updateStatus, deleteComplaint } from "../../api";

function FIRList() {
  const [firData, setFirData] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const translateStatus = (status) => {
    const statusKeyMap = {
      Pending: "pending",
      Accepted: "accepted",
      Rejected: "rejected",
      "Under Review": "underReview",
      Submitted: "submitted",
    };

    return t(statusKeyMap[status] || status || "pending");
  };

  const loadComplaints = async () => {
    try {
      const data = await fetchComplaints("", i18n.language);
      setFirData(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
  loadComplaints();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [i18n.language]);

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      setUpdatingId(complaintId);
      await updateStatus(complaintId, status, i18n.language);
      await loadComplaints();
    } catch (err) {
      console.error("Error updating complaint status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      await deleteComplaint(complaintId);
      setFirData((prev) => prev.filter((fir) => fir.complaint_id !== complaintId));
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  return (
    <div className="container  mb-5" style={{ width: "80%", marginTop: "12%" }}>
      <h4 className="text-center text-danger mb-5 fw-bold">{t("firComplaintList")}</h4>

      <table className="table table-bordered text-center align-middle shadow-sm">
        <thead className="table-danger">
          <tr>
            <th>{t("srNo")}</th>
            <th>{t("complaintId")}</th>
            <th>{t("category")}</th>
            <th>{t("date")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>

        <tbody>
          {firData.length === 0 ? (
            <tr>
              <td colSpan="5">{t("noComplaintsFound")}</td>
            </tr>
          ) : (
            firData.map((fir, index) => (
              <tr key={fir.complaint_id}>
                <td>{index + 1}</td>
                <td>{fir.complaint_id}</td>
                <td>{fir.category}</td>
                <td>{fir.date}</td>

                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/PoliceDashboard/complaint/${fir.complaint_id}`)}>
                    {t("viewDetails")}
                  </button>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleStatusUpdate(fir.complaint_id, "Accepted")}
                    disabled={updatingId === fir.complaint_id || fir.status !== "Pending"}
                  >
                    {t("accepted")}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate(fir.complaint_id, "Rejected")}
                    disabled={updatingId === fir.complaint_id || fir.status !== "Pending"}
                  >
                    {t("rejected")}
                  </button>
                  <button
                    className="btn btn-outline-dark btn-sm ms-2"
                    onClick={() => handleDeleteComplaint(fir.complaint_id)}
                  >
                    {t("delete")}
                  </button>
                  <div className="mt-2 fw-semibold">{translateStatus(fir.status || "Pending")}</div>
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
