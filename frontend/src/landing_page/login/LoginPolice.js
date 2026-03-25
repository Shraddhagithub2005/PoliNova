import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPolice() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    // Fixed Police Credentials
    const POLICE_EMAIL = "police@smartfir.com";
    const POLICE_PASSWORD = "Police@123";

    // Check credentials
    if (email === POLICE_EMAIL && password === POLICE_PASSWORD) {
      setError("");
      alert("Login successful!");
      navigate("/PoliceDashboard");
    } else {
      setError("Invalid Police ID or Password.");
      return;
    }

    // Clear fields after success
    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{  minHeight: "90vh", marginTop: "5%" }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: "500px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      >
        <h2 className="text-center mb-5">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              style={{ height: "55px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              style={{ height: "55px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-danger w-100"
            style={{ height: "50px", fontSize: "18px" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPolice;
