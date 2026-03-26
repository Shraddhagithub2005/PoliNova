import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ComplaintForm() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("incident");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const maxChars = 1500;

  const [incidentDetails, setIncidentDetails] = useState({
    victim_email: "",
    category: "",
    subCategory: "",
    date: "",
    hour: "",
    minute: "",
    period: "AM",
    delay: "No",
    location: "",
    description: "",
  });

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleTextChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
      setIncidentDetails({ ...incidentDetails, description: e.target.value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentDetails({ ...incidentDetails, [name]: value });
  };

  const validateForm = () => {
    if (!incidentDetails.victim_email.trim()) return t("pleaseEnterEmail");
    if (!incidentDetails.category) return t("pleaseSelectComplaintCategory");
    if (!incidentDetails.subCategory) return t("pleaseSelectSubCategory");
    if (!incidentDetails.date) return t("pleaseSelectIncidentDate");
    if (!incidentDetails.location) return t("pleaseSelectIncidentLocation");
    if (text.trim().length < 200) {
      return t("descriptionMinLength", { count: text.trim().length });
    }
    return null;
  };

  const convertTo24Hour = (timeStr) => {
    try {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  const handleSaveNext = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setActiveTab("preview");
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const time12hr = `${incidentDetails.hour}:${incidentDetails.minute} ${incidentDetails.period}`;
      const time24hr = convertTo24Hour(time12hr);

      const payload = {
        ...incidentDetails,
        description: text,
        time: time24hr,
        language: i18n.language,
      };

      const res = await fetch("http://127.0.0.1:8000/api/victim/complaint/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setIncidentDetails({
          victim_email: "",
          category: "",
          subCategory: "",
          date: "",
          hour: "",
          minute: "",
          period: "AM",
          delay: "No",
          location: "",
          description: "",
        });
        setText("");
        setActiveTab("incident");
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        setError(data.error || t("failedSubmitComplaint"));
      }
    } catch (err) {
      console.error(err);
      setError(t("serverErrorCheckBackend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      <ul className="nav nav-tabs" style={{ marginTop: "13%" }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "incident" ? "active btn-danger text-black" : ""}`} onClick={() => handleTabClick("incident")}>
            <i className="bi bi-exclamation-circle"></i> {t("incidentDetails")}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "suspect" ? "active" : ""}`} onClick={() => handleTabClick("suspect")}>
            <i className="bi bi-person-badge"></i> {t("suspectDetails")}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "complainant" ? "active" : ""}`} onClick={() => handleTabClick("complainant")}>
            <i className="bi bi-person"></i> {t("complainantDetails")}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "preview" ? "active" : ""}`} onClick={() => handleTabClick("preview")}>
            <i className="bi bi-pencil-square"></i> {t("previewSubmit")}
          </button>
        </li>
      </ul>

      <div
        className="alert text-dark mt-4"
        style={{
          backgroundColor: "#d9e7ff",
          borderRadius: "6px",
          padding: "10px 15px",
          border: "1px solid #b0cfff",
        }}
      >
        {t("complaintIncidentDetails")}
      </div>

      {submitted && <div className="alert alert-success text-center fw-bold mt-3">✅ {t("complaintSubmittedSuccessfully")}</div>}
      {error && <div className="alert alert-danger text-center fw-bold mt-3">{error}</div>}

      <div className="card mt-4 mb-5">
        <div className="card-body">
          {activeTab === "incident" && (
            <>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  {t("victimEmail")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <input
                    type="email"
                    className="form-control"
                    name="victim_email"
                    value={incidentDetails.victim_email}
                    onChange={handleChange}
                    placeholder={t("enterRegisteredEmail")}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  {t("categoryOfComplaint")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select className="form-select" name="category" value={incidentDetails.category} onChange={handleChange}>
                    <option value="">{t("select")}</option>
                    <option>{t("theft")}</option>
                    <option>{t("fraud")}</option>
                    <option>{t("cyberCrime")}</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  {t("subCategoryOfComplaint")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select className="form-select" name="subCategory" value={incidentDetails.subCategory} onChange={handleChange}>
                    <option value="">{t("select")}</option>
                    <option>{t("atmFraud")}</option>
                    <option>{t("onlineScam")}</option>
                    <option>{t("dataBreach")}</option>
                  </select>
                </div>
              </div>

              <hr />

              <div className="mb-3 row align-items-center">
                <label className="col-sm-4 col-form-label">
                  {t("approximateDateTime")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 d-flex gap-2">
                  <input type="date" className="form-control" name="date" value={incidentDetails.date} onChange={handleChange} />
                  <select className="form-select w-auto" name="hour" value={incidentDetails.hour} onChange={handleChange}>
                    <option>HH</option>
                    {[...Array(12)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}
                  </select>
                  <select className="form-select w-auto" name="minute" value={incidentDetails.minute} onChange={handleChange}>
                    <option>MM</option>
                    {[0, 15, 30, 45].map((m) => <option key={m}>{m.toString().padStart(2, "0")}</option>)}
                  </select>
                  <select className="form-select w-auto" name="period" value={incidentDetails.period} onChange={handleChange}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  {t("delayInReporting")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 d-flex align-items-center gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="delay" value="Yes" checked={incidentDetails.delay === "Yes"} onChange={handleChange} />
                    <label className="form-check-label">{t("yes")}</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="delay" value="No" checked={incidentDetails.delay === "No"} onChange={handleChange} />
                    <label className="form-check-label">{t("no")}</label>
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  {t("whereIncidentOccur")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select className="form-select" name="location" value={incidentDetails.location} onChange={handleChange}>
                    <option value="">{t("select")}</option>
                    <option>{t("socialMedia")}</option>
                    <option>{t("bankingApp")}</option>
                    <option>Email</option>
                    <option>{t("other")}</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row align-items-start">
                <label className="col-sm-4 col-form-label">
                  {t("additionalInformation")} <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder={t("insertAtLeast200")}
                    value={text}
                    onChange={handleTextChange}
                  ></textarea>
                  <small className="text-muted">
                    {t("maximumCharacters")} -{" "}
                    <span className={text.length > maxChars ? "text-danger fw-bold" : "fw-bold"}>
                      {maxChars - text.length}
                    </span>{" "}
                    {t("charactersLeft")}
                  </small>
                </div>
                <div className="mt-5 d-flex justify-content-center">
                  <button className="btn btn-danger" onClick={handleSaveNext}>
                    {t("saveDraftNext")}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "suspect" && <p className="text-secondary">{t("suspectDetailsSection")}</p>}
          {activeTab === "complainant" && <p className="text-secondary">{t("complainantDetailsSection")}</p>}

          {activeTab === "preview" && (
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white fw-bold">
                {t("complaintPreview")}
              </div>
              <div className="card-body">
                <p><strong>{t("email")}:</strong> {incidentDetails.victim_email}</p>
                <p><strong>{t("category")}:</strong> {incidentDetails.category}</p>
                <p><strong>{t("subCategoryOfComplaint")}:</strong> {incidentDetails.subCategory}</p>
                <p>
                  <strong>{t("dateTime")}:</strong>{" "}
                  {incidentDetails.date
                    ? `${incidentDetails.date} ${incidentDetails.hour}:${incidentDetails.minute} ${incidentDetails.period}`
                    : t("notProvided")}
                </p>
                <p><strong>{t("delayInReporting")}:</strong> {incidentDetails.delay}</p>
                <p><strong>{t("whereIncidentOccur")}:</strong> {incidentDetails.location}</p>
                <p><strong>{t("description")}:</strong></p>
                <p className="border rounded p-2 bg-light">{incidentDetails.description}</p>

                <div className="text-center mt-4">
                  <button className="btn btn-success px-4" onClick={handleSubmit} disabled={loading}>
                    {loading ? t("submitting") : t("submitComplaint")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;
