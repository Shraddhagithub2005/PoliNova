import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { getComplaintDetail } from "../../api";

function ComplaintDetails() {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getComplaintDetail(complaint_id, i18n.language)
      .then((data) => setComplaint(data))
      .catch((err) => {
        console.error("Error fetching complaint:", err);
        setError(t("failedLoadComplaintDetails"));
      });
  }, [complaint_id, i18n.language, t]);

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!complaint) {
    return <div className="text-center mt-5 text-muted">{t("loadingComplaintDetails")}</div>;
  }

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <div className="card shadow-lg">
        <div className="card-header bg-danger text-white fw-bold fs-5">
          {t("complaintDetails")} - {complaint.complaint_id}
        </div>
        <div className="card-body">
          <h5 className="mb-3 text-primary">{complaint.category}</h5>

          <div className="mb-3">
            <strong>{t("dateOfIncident")}:</strong> {complaint.date || "N/A"}
          </div>
          <div className="mb-3">
            <strong>{t("time")}:</strong> {complaint.time || "N/A"}
          </div>
          <div className="mb-3">
            <strong>{t("location")}:</strong> {complaint.location || "N/A"}
          </div>
          <div className="mb-3">
            <strong>{t("status")}:</strong> {complaint.status || t("pending")}
          </div>
          {complaint.notification ? (
            <div className="mb-3">
              <strong>{t("notification")}:</strong>{" "}
              <i className="bi bi-bell-fill me-2"></i>
              {complaint.notification}
            </div>
          ) : null}
          <div className="mb-3">
            <strong>{t("delayInReportingShort")}:</strong> {complaint.delay || "N/A"}
          </div>
          <div className="mb-3">
            <strong>{t("subCategory")}:</strong> {complaint.subCategory || "N/A"}
          </div>
          <div className="mb-3">
            <strong>{t("crimeTypeLabel")}:</strong> {complaint.crime_type || complaint.category || "N/A"}
          </div>

          <div className="mb-4">
            <strong>{t("description")}:</strong>
            <p className="border rounded p-3 bg-light mt-2">{complaint.description || "N/A"}</p>
          </div>

          <hr />
          <h6 className="fw-bold text-danger">{t("victimInformation")}</h6>
          <div className="mb-2"><strong>{t("name")}:</strong> {complaint.name || complaint.victim_name || "N/A"}</div>
          <div className="mb-2"><strong>{t("email")}:</strong> {complaint.email || complaint.victim_email || "N/A"}</div>
          <div className="mb-2"><strong>{t("phone")}:</strong> {complaint.phone || complaint.victim_phone || "N/A"}</div>
          <div className="mb-3"><strong>{t("address")}:</strong> {complaint.victim_address || "N/A"}</div>
          <div className="mb-3">
            <strong>{t("timeline")}:</strong>
            <div className="mt-2">
              {Array.isArray(complaint.timeline) && complaint.timeline.length > 0 ? (
                complaint.timeline.map((entry, index) => (
                  <div key={`${complaint.complaint_id}-timeline-${index}`}>
                    {entry.status} - {entry.time}
                  </div>
                ))
              ) : (
                <div>N/A</div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
              {t("backToList")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
