import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ComplaintForm() {
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
    if (!incidentDetails.victim_email.trim()) return "Please enter your email.";
    if (!incidentDetails.category) return "Please select a complaint category.";
    if (!incidentDetails.subCategory) return "Please select a sub-category.";
    if (!incidentDetails.date) return "Please select the date of the incident.";
    if (!incidentDetails.location) return "Please select where the incident occurred.";
    if (text.trim().length < 200)
      return `Description should be at least 200 characters. Currently: ${text.trim().length}`;
    return null;
  };

  // ✅ Convert 12-hour format to 24-hour format before sending
  const convertTo24Hour = (timeStr) => {
    try {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    } catch {
      return timeStr; // fallback
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
      let time12hr = `${incidentDetails.hour}:${incidentDetails.minute} ${incidentDetails.period}`;
      let time24hr = convertTo24Hour(time12hr); // ✅ convert before sending

      const payload = {
        ...incidentDetails,
        description: text,
        time: time24hr, // ✅ fixed format for backend
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
        setError(data.error || "Failed to submit complaint.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "incident" ? "active btn-danger text-black" : ""}`}
            onClick={() => handleTabClick("incident")}
          >
            <i className="bi bi-exclamation-circle"></i> Incident Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "suspect" ? "active" : ""}`}
            onClick={() => handleTabClick("suspect")}
          >
            <i className="bi bi-person-badge"></i> Suspect Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "complainant" ? "active" : ""}`}
            onClick={() => handleTabClick("complainant")}
          >
            <i className="bi bi-person"></i> Complainant Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => handleTabClick("preview")}
          >
            <i className="bi bi-pencil-square"></i> Preview & Submit
          </button>
        </li>
      </ul>

      {/* Section Header */}
      <div
        className="alert text-dark mt-4"
        style={{
          backgroundColor: "#d9e7ff",
          borderRadius: "6px",
          padding: "10px 15px",
          border: "1px solid #b0cfff",
        }}
      >
        Complaint / Incident Details
      </div>

      {/* Success or Error Messages */}
      {submitted && (
        <div className="alert alert-success text-center fw-bold mt-3">
          ✅ Complaint submitted successfully!
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center fw-bold mt-3">{error}</div>
      )}

      {/* Form Content */}
      <div className="card mt-4 mb-5">
        <div className="card-body">
          {/* Incident Tab */}
          {activeTab === "incident" && (
            <>
              {/* Victim Email */}
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Victim Email <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <input
                    type="email"
                    className="form-control"
                    name="victim_email"
                    value={incidentDetails.victim_email}
                    onChange={handleChange}
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Category of complaint <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-select"
                    name="category"
                    value={incidentDetails.category}
                    onChange={handleChange}
                  >
                    <option>---Select---</option>
                    <option>Theft</option>
                    <option>Fraud</option>
                    <option>Cyber Crime</option>
                  </select>
                </div>
              </div>

              {/* Subcategory */}
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Sub-Category of complaint <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-select"
                    name="subCategory"
                    value={incidentDetails.subCategory}
                    onChange={handleChange}
                  >
                    <option>--Select--</option>
                    <option>ATM Fraud</option>
                    <option>Online Scam</option>
                    <option>Data Breach</option>
                  </select>
                </div>
              </div>

              <hr />

              {/* Date & Time */}
              <div className="mb-3 row align-items-center">
                <label className="col-sm-4 col-form-label">
                  Approximate date & time of Incident <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 d-flex gap-2">
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={incidentDetails.date}
                    onChange={handleChange}
                  />
                  <select
                    className="form-select w-auto"
                    name="hour"
                    value={incidentDetails.hour}
                    onChange={handleChange}
                  >
                    <option>HH</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select
                    className="form-select w-auto"
                    name="minute"
                    value={incidentDetails.minute}
                    onChange={handleChange}
                  >
                    <option>MM</option>
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                  <select
                    className="form-select w-auto"
                    name="period"
                    value={incidentDetails.period}
                    onChange={handleChange}
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* Delay */}
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Is there any delay in reporting? <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 d-flex align-items-center gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="delay"
                      value="Yes"
                      checked={incidentDetails.delay === "Yes"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="delay"
                      value="No"
                      checked={incidentDetails.delay === "No"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Where did the incident occur? <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-select"
                    name="location"
                    value={incidentDetails.location}
                    onChange={handleChange}
                  >
                    <option>---Select---</option>
                    <option>Social Media</option>
                    <option>Banking App</option>
                    <option>Email</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3 row align-items-start">
                <label className="col-sm-4 col-form-label">
                  Additional information: <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Insert at least 200 characters."
                    value={text}
                    onChange={handleTextChange}
                  ></textarea>
                  <small className="text-muted">
                    Maximum of 1500 characters -{" "}
                    <span className={text.length > maxChars ? "text-danger fw-bold" : "fw-bold"}>
                      {maxChars - text.length}
                    </span>{" "}
                    characters left
                  </small>
                </div>
                <div className="mt-5 d-flex justify-content-center">
                  <button className="btn btn-danger" onClick={handleSaveNext}>
                    Save as Draft & Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Other Tabs */}
          {activeTab === "suspect" && <p className="text-secondary">Suspect details section...</p>}
          {activeTab === "complainant" && (
            <p className="text-secondary">Complainant details section...</p>
          )}

          {/* Preview */}
          {activeTab === "preview" && (
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white fw-bold">
                Complaint Preview
              </div>
              <div className="card-body">
                <p><strong>Email:</strong> {incidentDetails.victim_email}</p>
                <p><strong>Category:</strong> {incidentDetails.category}</p>
                <p><strong>Sub-Category:</strong> {incidentDetails.subCategory}</p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {incidentDetails.date
                    ? `${incidentDetails.date} ${incidentDetails.hour}:${incidentDetails.minute} ${incidentDetails.period}`
                    : "Not provided"}
                </p>
                <p><strong>Delay in Reporting:</strong> {incidentDetails.delay}</p>
                <p><strong>Location:</strong> {incidentDetails.location}</p>
                <p><strong>Description:</strong></p>
                <p className="border rounded p-2 bg-light">{incidentDetails.description}</p>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-success px-4"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Complaint"}
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
