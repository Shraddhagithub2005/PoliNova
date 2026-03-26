import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";

function UserProfileForm() {
  const { t } = useTranslation();
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

  const titleOptions = [
    { value: "Mr", label: t("mr") },
    { value: "Mrs", label: t("mrs") },
    { value: "Miss", label: t("miss") },
    { value: "Dr", label: t("dr") },
    { value: "Prof", label: t("prof") },
    { value: "Shri", label: t("shri") },
    { value: "Smt", label: t("smt") },
  ];

  const addressFieldLabels = {
    houseNo: t("houseNo"),
    street: t("street"),
    colony: t("colony"),
    city: t("city"),
    tehsil: t("tehsil"),
    country: t("country"),
    state: t("state"),
    district: t("district"),
    policeStation: t("policeStation"),
    pincode: t("pincode"),
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setLoading(false);
      return;
    }

    setFormData((prev) => ({ ...prev, email, loginId: email }));

    api
      .get(`victim/profile/${email}/`)
      .then((res) => {
        if (res.data && res.data.email) {
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
    const payload = { ...formData, email: formData.loginId };

    api
      .post("victim/profile/save/", payload)
      .then((res) => {
        setFormData(res.data);
        setProfileSaved(true);
        alert(t("profileSavedSuccessfully"));
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert(t("errorSavingProfile"));
      });
  };

  if (loading) return <p>{t("loading")}</p>;

  if (profileSaved) {
    return (
      <div className="container" style={{ marginTop: "200px", marginBottom: "100px" }}>
        <h4 className="mb-4 text-center">{t("userProfile")}</h4>
        <div className="card shadow-lg p-4 rounded-4 border-0" style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "#f8f9fa" }}>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <strong>{t("title")}:</strong> {formData.title}
            </div>
            <div className="col-md-6 mb-2">
              <strong>{t("name")}:</strong> {formData.name}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <strong>{t("mobile")}:</strong> {formData.mobile}
            </div>
            <div className="col-md-6 mb-2">
              <strong>{t("email")}:</strong> {formData.email}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <strong>{t("dob")}:</strong> {formData.dob}
            </div>
            <div className="col-md-6 mb-2">
              <strong>{t("gender")}:</strong> {formData.gender}
            </div>
          </div>
          <div className="mb-3">
            <strong>{t("relation")}:</strong> {formData.relationType} - {formData.relationName}
          </div>
          <h5 className="mt-4 mb-2">{t("presentAddress")}:</h5>
          <div className="p-3 rounded-3" style={{ backgroundColor: "#ffffff", border: "1px solid #dee2e6" }}>
            <p className="mb-1">{formData.address.houseNo}, {formData.address.street}, {formData.address.colony}</p>
            <p className="mb-1">{formData.address.city}, {formData.address.tehsil}, {formData.address.district}</p>
            <p className="mb-0">{formData.address.state}, {formData.address.country} - {formData.address.pincode}</p>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-outline-danger" onClick={() => setProfileSaved(false)}>
              {t("editProfile")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mb-5 p-4 shadow-sm bg-light rounded"
      style={{
        maxWidth: "900px",
        marginTop: "180px",
      }}
    >
      <h4 className="mb-4 text-black border-bottom pb-2">{t("userProfileDetails")}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{t("loginId")}:</label>
          <input
            type="email"
            className="form-control"
            name="loginId"
            placeholder={t("enterEmail")}
            value={formData.loginId}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label me-3">{t("title")}:</label>
          {titleOptions.map((title) => (
            <div className="form-check form-check-inline" key={title.value}>
              <input
                className="form-check-input"
                type="radio"
                name="title"
                value={title.value}
                checked={formData.title === title.value}
                onChange={handleChange}
              />
              <label className="form-check-label">{title.label}</label>
            </div>
          ))}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{t("name")}:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder={t("enterFullName")}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t("mobile")}:</label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              placeholder={t("enterMobileNumber")}
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{t("dateOfBirth")}:</label>
            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t("gender")}:</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">{t("selectGender")}</option>
              <option>{t("male")}</option>
              <option>{t("female")}</option>
              <option>{t("other")}</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">{t("fatherMotherSpouse")}:</label>
            <select className="form-select" name="relationType" value={formData.relationType} onChange={handleChange}>
              <option value="">{t("select")}</option>
              <option>{t("father")}</option>
              <option>{t("mother")}</option>
              <option>{t("spouse")}</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">{t("name")}:</label>
            <input
              type="text"
              className="form-control"
              name="relationName"
              placeholder={t("enterName")}
              value={formData.relationName}
              onChange={handleChange}
            />
          </div>
        </div>

        <h5 className="text-black mt-4 mb-3">{t("presentAddress")}</h5>
        <div className="row g-3">
          {["houseNo", "street", "colony", "city", "tehsil", "country", "state", "district", "policeStation", "pincode"].map((field) => (
            <div className="col-md-6 mb-3" key={field}>
              <label className="form-label">{addressFieldLabels[field]}:</label>
              {field === "country" || field === "state" || field === "district" || field === "policeStation" ? (
                <select className="form-select" name={field} value={formData.address[field]} onChange={handleChange}>
                  <option value="">{field === "country" ? t("india") : t("select")}</option>
                  {field === "country" && <option>{t("india")}</option>}
                  {field === "state" && [t("maharashtra"), t("goa"), t("karnataka")].map((opt) => <option key={opt}>{opt}</option>)}
                  {field === "district" && [t("pune"), t("mumbai"), t("nashik")].map((opt) => <option key={opt}>{opt}</option>)}
                  {field === "policeStation" && [t("shivajiNagar"), t("hadapsar"), t("wakad")].map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" className="form-control" name={field} value={formData.address[field]} onChange={handleChange} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <button type="submit" className="btn btn-danger px-4 py-2">{t("saveContinue")}</button>
        </div>
      </form>
    </div>
  );
}

export default UserProfileForm;
