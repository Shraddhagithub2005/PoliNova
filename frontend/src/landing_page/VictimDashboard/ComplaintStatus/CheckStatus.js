import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchComplaints } from "../../../api";

function CheckStatus() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const victimEmail = localStorage.getItem("victimEmail") || "";

    fetchComplaints(victimEmail, i18n.language)
      .then((data) => setComplaints(data))
      .catch((err) => {
        console.error("Error fetching complaint status:", err);
        setError(t("failedLoadComplaintStatus"));
      });
  }, [i18n.language, t]);

  return (
    <div>
      <h1>{t("checkStatus")}</h1>
      {error ? <p className="text-danger">{error}</p> : null}
      {complaints.length === 0 ? (
        <p>{t("noComplaintsFound")}</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-danger">
              <tr>
                <th>{t("complaintId")}</th>
                <th>{t("category")}</th>
                <th>{t("date")}</th>
                <th>{t("status")}</th>
                <th>{t("notification")}</th>
                <th>{t("timeline")}</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.complaint_id}>
                  <td>{complaint.complaint_id}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.date}</td>
                  <td>{translateStatus(complaint.status || "Pending")}</td>
                  <td>
                    {complaint.notification ? (
                      <>
                        <i className="bi bi-bell-fill me-2"></i>
                        {complaint.notification}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-start">
                    {Array.isArray(complaint.timeline) && complaint.timeline.length > 0 ? (
                      complaint.timeline.map((entry, index) => (
                        <div key={`${complaint.complaint_id}-${index}`}>
                          {translateStatus(entry.status)} - {entry.time}
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CheckStatus;
