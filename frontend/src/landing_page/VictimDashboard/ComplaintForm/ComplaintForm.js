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
  const [complaintId, setComplaintId] = useState(null);

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

  const [suspectDetails, setSuspectDetails] = useState({
    gender: "",
    age: "",
    faceShape: "",
    skinTone: "",
    forehead: "",
    hairType: "",
    hairColor: "",
    eyeShape: "",
    eyeColor: "",
    eyebrow: "",
    noseSize: "",
    noseShape: "",
    lipType: "",
    beard: "",
    mustache: "",
    identifiers: ""
  });

  const handleTabClick = (tab) => {
    setError(""); // Clear error when switching tabs manually
    setActiveTab(tab);
  };

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

  const handleSuspectChange = (e) => {
    const { name, value } = e.target;
    setSuspectDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Updated Validation for Suspect Details
  const handleSuspectNext = async () => {
  const requiredFields = [
    "gender", "age", "faceShape", "skinTone", "forehead", 
    "hairType", "hairColor", "eyeColor", "eyeShape", 
    "eyebrow", "noseSize", "noseShape", "lipType", "beard", "mustache"
  ];

  const isAnyFieldEmpty = requiredFields.some(field => !suspectDetails[field]);

  if (isAnyFieldEmpty) {
    setError("Please fill in all mandatory suspect facial features before proceeding.");
    window.scrollTo(0, 0);
    return;
  }

  if (!complaintId) {
    setError("Please submit complaint first before adding suspect.");
    return;
  }

  setError("");

  try {
    const res = await fetch("http://127.0.0.1:8000/api/suspect/save/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...suspectDetails,
        complaint_id: complaintId   // ✅ IMPORTANT
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Suspect details saved successfully!");
    } else {
      setError(data.error || "Failed to save suspect details.");
    }
  } catch (err) {
    console.error(err);
    setError("Server error while saving suspect details.");
  }
};

  const validateForm = () => {
    if (!incidentDetails.victim_email.trim()) return "Please enter your email.";
    if (!incidentDetails.category || incidentDetails.category === "---Select---") return "Please select a complaint category.";
    if (!incidentDetails.subCategory || incidentDetails.subCategory === "--Select--") return "Please select a sub-category.";
    if (!incidentDetails.date) return "Please select the date of the incident.";
    if (!incidentDetails.location || incidentDetails.location === "---Select---") return "Please select where the incident occurred.";
    if (text.trim().length < 200)
      return `Description should be at least 200 characters. Currently: ${text.trim().length}`;
    return null;
  };

  const convertTo24Hour = (timeStr) => {
    try {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
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
      window.scrollTo(0, 0);
      return;
    }
    setError("");
    setActiveTab("suspect");
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
      let time24hr = convertTo24Hour(time12hr);

      const payload = {
        ...incidentDetails,
        ...suspectDetails,
        description: text,
        time: time24hr,
      };

      const res = await fetch("http://127.0.0.1:8000/api/victim/complaint/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);

        // ✅ SAVE complaint_id from backend
        setComplaintId(data.complaint_id);

        setText("");
        setActiveTab("incident");
        setTimeout(() => setSubmitted(false), 4000);
      }
      else {
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
    <div className="container mt-4 mb-4" >
      <ul className="nav nav-tabs" style={{marginTop:"13%"}}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "incident" ? "active btn-danger text-black" : ""}`} onClick={() => handleTabClick("incident")}>
            <i className="bi bi-exclamation-circle"></i> Incident Details
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "suspect" ? "active" : ""}`} onClick={() => handleTabClick("suspect")}>
            <i className="bi bi-person-badge"></i> Suspect Details
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "complainant" ? "active" : ""}`} onClick={() => handleTabClick("complainant")}>
            <i className="bi bi-person"></i> Complainant Details
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "preview" ? "active" : ""}`} onClick={() => handleTabClick("preview")}>
            <i className="bi bi-pencil-square"></i> Preview & Submit
          </button>
        </li>
      </ul>

      <div className="alert text-dark mt-4" style={{ backgroundColor: "#d9e7ff", borderRadius: "6px", padding: "10px 15px", border: "1px solid #b0cfff" }}>
        Complaint / Incident Details
      </div>

      {submitted && <div className="alert alert-success text-center fw-bold mt-3">✅ Complaint submitted successfully!</div>}
      {error && <div className="alert alert-danger text-center fw-bold mt-3">{error}</div>}

      <div className="card mt-4 mb-5">
        <div className="card-body">
          {activeTab === "incident" && (
            <>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Victim Email <span className="text-danger">*</span></label>
                <div className="col-sm-8">
                  <input type="email" className="form-control" name="victim_email" value={incidentDetails.victim_email} onChange={handleChange} placeholder="Enter your registered email" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Category <span className="text-danger">*</span></label>
                <div className="col-sm-8">
                  <select className="form-select" name="category" value={incidentDetails.category} onChange={handleChange}>
                    <option>---Select---</option>
                    <option>Theft</option>
                    <option>Fraud</option>
                    <option>Cyber Crime</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Sub-Category <span className="text-danger">*</span></label>
                <div className="col-sm-8">
                  <select className="form-select" name="subCategory" value={incidentDetails.subCategory} onChange={handleChange}>
                    <option>--Select--</option>
                    <option>ATM Fraud</option>
                    <option>Online Scam</option>
                    <option>Data Breach</option>
                  </select>
                </div>
              </div>

              <hr />

              <div className="mb-3 row align-items-center">
                <label className="col-sm-4 col-form-label">Date & Time <span className="text-danger">*</span></label>
                <div className="col-sm-8 d-flex gap-2">
                  <input type="date" className="form-control" name="date" value={incidentDetails.date} onChange={handleChange} />
                  <select className="form-select w-auto" name="hour" value={incidentDetails.hour} onChange={handleChange}>
                    <option>HH</option>
                    {[...Array(12)].map((_, i) => (<option key={i + 1}>{i + 1}</option>))}
                  </select>
                  <select className="form-select w-auto" name="minute" value={incidentDetails.minute} onChange={handleChange}>
                    <option>MM</option>
                    {[0, 15, 30, 45].map((m) => (<option key={m}>{m.toString().padStart(2, "0")}</option>))}
                  </select>
                  <select className="form-select w-auto" name="period" value={incidentDetails.period} onChange={handleChange}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Delay? <span className="text-danger">*</span></label>
                <div className="col-sm-8 d-flex align-items-center gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="delay" value="Yes" checked={incidentDetails.delay === "Yes"} onChange={handleChange} />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="delay" value="No" checked={incidentDetails.delay === "No"} onChange={handleChange} />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Location <span className="text-danger">*</span></label>
                <div className="col-sm-8">
                  <select className="form-select" name="location" value={incidentDetails.location} onChange={handleChange}>
                    <option>---Select---</option>
                    <option>Social Media</option>
                    <option>Banking App</option>
                    <option>Email</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row align-items-start">
                <label className="col-sm-4 col-form-label">Description <span className="text-danger">*</span></label>
                <div className="col-sm-8">
                  <textarea className="form-control" rows="4" placeholder="Min 200 chars." value={text} onChange={handleTextChange}></textarea>
                  <small className="text-muted">Left: {maxChars - text.length}</small>
                </div>
                <div className="mt-5 d-flex justify-content-center">
                  <button className="btn btn-danger" onClick={handleSaveNext}>Save as Draft & Next</button>
                </div>
              </div>
            </>
          )}

          {activeTab === "suspect" && (
            <>
              <h5 className="text-danger border-bottom pb-2">Facial Features</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Gender <span className="text-danger">*</span></label>
                  <select className="form-select" name="gender" value={suspectDetails.gender} onChange={handleSuspectChange}>
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                
                <div className="col-md-6">
                  <label>Approx Age <span className="text-danger">*</span></label>
                  <select className="form-select" name="age" value={suspectDetails.age} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>18–25</option><option>25–35</option><option>35–50</option><option>50+</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Face Shape <span className="text-danger">*</span></label>
                  <select className="form-select" name="faceShape" value={suspectDetails.faceShape} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Oval</option><option>Round</option><option>Square</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Skin Tone <span className="text-danger">*</span></label>
                  <select className="form-select" name="skinTone" value={suspectDetails.skinTone} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Fair</option><option>Brown</option><option>Dark</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Forehead <span className="text-danger">*</span></label>
                  <select className="form-select" name="forehead" value={suspectDetails.forehead} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Small</option><option>Medium</option><option>Large</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Hair Type <span className="text-danger">*</span></label>
                  <select className="form-select" name="hairType" value={suspectDetails.hairType} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Straight</option><option>Curly</option><option>Bald</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label>Hair Color <span className="text-danger">*</span></label>
                  <select className="form-select" name="hairColor" value={suspectDetails.hairColor} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Black</option><option>Brown</option><option>Grey</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />
              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Eye Color <span className="text-danger">*</span></label>
                  <select className="form-select" name="eyeColor" value={suspectDetails.eyeColor} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Black</option><option>Brown</option><option>Blue</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Eye Shape <span className="text-danger">*</span></label>
                  <select className="form-select" name="eyeShape" value={suspectDetails.eyeShape} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Small</option><option>Large</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Eyebrow <span className="text-danger">*</span></label>
                  <select className="form-select" name="eyebrow" value={suspectDetails.eyebrow} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Thick</option><option>Thin</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Nose Size <span className="text-danger">*</span></label>
                  <select className="form-select" name="noseSize" value={suspectDetails.noseSize} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Small</option><option>Large</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Nose Shape <span className="text-danger">*</span></label>
                  <select className="form-select" name="noseShape" value={suspectDetails.noseShape} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Straight</option><option>Flat</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label>Lip Type <span className="text-danger">*</span></label>
                  <select className="form-select" name="lipType" value={suspectDetails.lipType} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>Thin</option><option>Thick</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Beard <span className="text-danger">*</span></label>
                  <select className="form-select" name="beard" value={suspectDetails.beard} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>None</option><option>Light</option><option>Full</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label>Mustache <span className="text-danger">*</span></label>
                  <select className="form-select" name="mustache" value={suspectDetails.mustache} onChange={handleSuspectChange}>
                    <option value="">Select</option><option>None</option><option>Thin</option><option>Thick</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <hr />

              <div className="mb-3">
                <label>Special Identifiers (Optional)</label>
                <textarea className="form-control" name="identifiers" placeholder="Tattoos, scars..." value={suspectDetails.identifiers} onChange={handleSuspectChange}></textarea>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-danger px-5" onClick={handleSuspectNext}>Submit</button>
              </div>
            </>
          )}

          {activeTab === "complainant" && (
            <div className="text-center">
              <p className="text-secondary">Complainant details section...</p>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white fw-bold">Complaint Preview</div>
              <div className="card-body">
                <p><strong>Email:</strong> {incidentDetails.victim_email}</p>
                <p><strong>Category:</strong> {incidentDetails.category}</p>
                <p><strong>Description:</strong> {incidentDetails.description}</p>
                <div className="text-center mt-4">
                  <button className="btn btn-success px-4" onClick={handleSubmit} disabled={loading}>
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