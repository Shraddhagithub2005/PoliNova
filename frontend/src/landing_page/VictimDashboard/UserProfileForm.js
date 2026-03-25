import React, { useState, useEffect } from "react";
import api from "../../api"; // your api.js instance

function UserProfileForm() {
  const [formData, setFormData] = useState({
    loginId: "",
    title: "",
    name: "",
    mobile: "",
    dob: "",
    gender: "",
    email: "",
    relationType: "",
    relationName: "",
    address: {
      houseNo: "",
      street: "",
      colony: "",
      city: "",
      tehsil: "",
      country: "India",
      state: "Maharashtra",
      district: "",
      policeStation: "",
      pincode: "",
    },
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile on component mount
  useEffect(() => {
    const email = localStorage.getItem("email"); // get email stored on login
    if (!email) {
      setLoading(false);
      return;
    }

    setFormData((prev) => ({ ...prev, email, loginId: email }));

    api
      .get(`victim/profile/${email}/`) // call backend via api.js
      .then((res) => {
        if (res.data && res.data.email) {
          // Ensure address is object
          const address = res.data.address || {};
          setFormData({ ...res.data, address, loginId: res.data.email });
          setProfileSaved(true);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure email is included
    const payload = { ...formData, email: formData.loginId };

    api
      .post("victim/profile/save/", payload)
      .then((res) => {
        setFormData(res.data);
        setProfileSaved(true);
        alert("Profile saved successfully!");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error saving profile");
      });
  };

  if (loading) return <p>Loading...</p>;

  // ✅ Show profile card if profile is saved
if (profileSaved) {
  return (
    <div
      className="container"
      style={{ marginTop: "200px" ,marginBottom:"100px"}}  // 🔥 pushes below navbar
    >
      <h4 className="mb-4 text-center">User Profile</h4>
      <div className="card shadow-lg p-4 rounded-4 border-0" style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "#f8f9fa" }}>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Title:</strong> {formData.title}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Name:</strong> {formData.name}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Mobile:</strong> {formData.mobile}
          </div>
          <div className="col-md-6 mb-2">
  <strong>Email:</strong> {formData.email} 
</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>DOB:</strong> {formData.dob}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Gender:</strong> {formData.gender}
          </div>
        </div>
        <div className="mb-3">
          <strong>Relation:</strong> {formData.relationType} - {formData.relationName}
        </div>
        <h5 className="mt-4 mb-2">Address:</h5>
        <div className="p-3 rounded-3" style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}>
          <p className="mb-1">{formData.address.houseNo}, {formData.address.street}, {formData.address.colony}</p>
          <p className="mb-1">{formData.address.city}, {formData.address.tehsil}, {formData.address.district}</p>
          <p className="mb-0">{formData.address.state}, {formData.address.country} - {formData.address.pincode}</p>
        </div>
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-danger"
            onClick={() => setProfileSaved(false)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}


  // ✅ Show form if profile not saved
  return (
    <div
      className="container mb-5 p-4 shadow-sm bg-light rounded"
      style={{
        maxWidth: "900px",
        marginTop: "180px"   // 🔥 push below navbar
      }}
    >
      <h4 className="mb-4 text-black border-bottom pb-2">User Profile Details</h4>
      <form onSubmit={handleSubmit}>
        {/* Login ID */}
        <div className="mb-3">
          <label className="form-label">Login ID:</label>
          <input
            type="email"
            className="form-control"
            name="loginId"
            placeholder="Enter email"
            value={formData.loginId}
            onChange={handleChange}
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label me-3">Title:</label>
          {["Mr", "Mrs", "Miss", "Dr", "Prof", "Shri", "Smt"].map((title) => (
            <div className="form-check form-check-inline" key={title}>
              <input
                className="form-check-input"
                type="radio"
                name="title"
                value={title}
                checked={formData.title === title}
                onChange={handleChange}
              />
              <label className="form-check-label">{title}</label>
            </div>
          ))}
        </div>

        {/* Name, Mobile, DOB, Gender */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile:</label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date of Birth:</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender:</label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Relation */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Father/Mother/Spouse:</label>
            <select
              className="form-select"
              name="relationType"
              value={formData.relationType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Father</option>
              <option>Mother</option>
              <option>Spouse</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              name="relationName"
              placeholder="Enter name"
              value={formData.relationName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address */}
        <h5 className="text-black mt-4 mb-3">Present Address</h5>
        <div className="row g-3">
          {["houseNo","street","colony","city","tehsil","country","state","district","policeStation","pincode"].map(field => (
            <div className="col-md-6 mb-3" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase()+field.slice(1)}:</label>
              {field === "country" || field === "state" || field === "district" || field === "policeStation" ? (
                <select className="form-select" name={field} value={formData.address[field]} onChange={handleChange}>
                  <option value="">{field === "country" ? "India" : "Select"}</option>
                  {field === "country" && <option>India</option>}
                  {field === "state" && ["Maharashtra","Goa","Karnataka"].map(opt => <option key={opt}>{opt}</option>)}
                  {field === "district" && ["Pune","Mumbai","Nashik"].map(opt => <option key={opt}>{opt}</option>)}
                  {field === "policeStation" && ["Shivaji Nagar","Hadapsar","Wakad"].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" className="form-control" name={field} value={formData.address[field]} onChange={handleChange} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <button type="submit" className="btn btn-danger px-4 py-2">Save & Continue</button>
        </div>
      </form>
    </div>
  );
}

export default UserProfileForm;
