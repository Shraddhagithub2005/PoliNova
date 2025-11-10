import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        email: "",
        aadhaar: "",
        phone: "",
        password: "",
        otp: "",
    });

    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [qrSent, setQrSent] = useState(false);
    const [qrSrc, setQrSrc] = useState("");
    const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }

        // 🔹 Auto-fetch City, State, Country when Pincode is entered
        if (name === "pincode" && value.length === 6) {
            fetch(`https://api.postalpincode.in/pincode/${value}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
                        const place = data[0].PostOffice[0];
                        setFormData((prev) => ({
                            ...prev,
                            city: place.District || "",
                            state: place.State || "",
                            country: place.Country || "India",
                        }));
                    } else {
                        alert("Invalid Pincode or no data found.");
                        setFormData((prev) => ({
                            ...prev,
                            city: "",
                            state: "",
                            country: "",
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching pincode data:", err);
                    alert("Failed to fetch details for this pincode.");
                });
        }
    };

    // --- EMAIL VERIFICATION ---
    const handleVerifyEmail = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/send-verification-email/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Verification code sent to your email!");
                setEmailOtpSent(true);
                setFormData(prev => ({ ...prev, otp: "" }));
            } else {
                alert("Error: " + (data.error || "Failed to send verification email."));
            }
        } catch (error) {
            console.error("Error sending email verification:", error);
            alert("Error sending verification email: " + error.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/verify-email/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Email verified successfully!");
                setEmailVerified(true);
                setEmailOtpSent(false);
                setFormData(prev => ({ ...prev, otp: "" }));
            } else {
                alert("Error verifying OTP: " + (data.error || "Invalid OTP"));
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            alert("Error verifying OTP: " + error.message);
        }
    };

    // --- PHONE VERIFICATION (QR / Authenticator) ---
    const handleGenerateQR = async () => {
        if (!formData.phone) return alert("Enter phone number first!");
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/generate-qr/?phone=${formData.phone}`,
                { responseType: "blob" }
            );
            const imgUrl = URL.createObjectURL(res.data);
            setQrSrc(imgUrl);
            setQrSent(true);
            setFormData(prev => ({ ...prev, otp: "" }));
            alert("📱 Scan this QR in your Google Authenticator app!");
        } catch (err) {
            console.error("QR Generation Error:", err);
            alert("Error generating QR code. Check phone number format or backend status.");
        }
    };

    const handleVerifyPhoneOTP = async () => {
        if (!formData.otp) return alert("Enter OTP first!");
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
                phone: formData.phone,
                otp: formData.otp,
            });

            if (res.data.message) {
                setPhoneOtpVerified(true);
                alert("Phone verified successfully!");
                setQrSent(false);
                setFormData(prev => ({ ...prev, otp: "" }));
            }
        } catch (err) {
            console.error("Phone OTP Verification Error:", err);
            alert(err.response?.data?.error || "OTP verification failed. Check the code and try again.");
        }
    };

    // --- STRONG PASSWORD VALIDATION ---
    const validatePassword = (password) => {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            setPasswordError(
                "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };

    // --- SIGNUP FUNCTION ---
    const handleSignup = async (e) => {
        e.preventDefault();

        // ✅ Check for empty fields before proceeding
        for (const [key, value] of Object.entries(formData)) {
            if (!value && key !== "otp") {
                alert(`Please fill the ${key} field before signing up!`);
                return;
            }
        }

        if (!emailVerified) return alert("Please verify your email before signing up!");
        if (!phoneOtpVerified) return alert("Please verify your phone number using the Authenticator app first!");
        if (!validatePassword(formData.password)) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/api/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful!");
                navigate("/LoginVictim");
            } else {
                alert("Signup failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Error during signup: " + error.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5 mb-5" style={{ minHeight: "100vh" }}>
            <div className="p-5 shadow-lg" style={{ width: "700px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#fff" }}>
                <h2 className="text-center mb-5">Signup</h2>

                <form onSubmit={handleSignup}>
                    {/* Name */}
                    <div className="row mb-4">
                        <div className="col">
                            <label>First Name</label>
                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                        <div className="col">
                            <label>Last Name</label>
                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label>Address</label>
                        <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required style={{ height: "50px" }} />
                    </div>

                    {/* City & State */}
                    <div className="row mb-4">
                        <div className="col">
                            <label>Country</label>
                            <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                        <div className="col">
                            <label>State</label>
                            <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                    </div>

                    {/* Pincode & Country */}
                    <div className="row mb-4">
                        <div className="col">
                            <label>City</label>
                            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                        <div className="col">
                            <label>Pin Code</label>
                            <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required style={{ height: "50px" }} />
                        </div>
                    </div>

                    {/* Aadhaar */}
                    <div className="mb-4">
                        <label>Aadhaar Card Number</label>
                        <input type="text" className="form-control" name="aadhaar" placeholder="Aadhaar Card Number" value={formData.aadhaar} onChange={handleChange} required style={{ height: "50px" }} />
                    </div>

                    {/* Email + Verify */}
                    <div className="mb-4 d-flex align-items-center">
                        <input type="email" className="form-control me-2" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ height: "50px" }} disabled={emailVerified || emailOtpSent} />
                        <button type="button" className={`btn ${emailVerified ? "btn-success" : "btn-outline-danger"}`} onClick={handleVerifyEmail} disabled={!formData.email || emailVerified || emailOtpSent}>
                            {emailVerified ? "Verified " : "Send OTP"}
                        </button>
                    </div>

                    {/* OTP input (email) */}
                    {emailOtpSent && !emailVerified && (
                        <div className="mb-4 d-flex align-items-center">
                            <input type="text" className="form-control me-2" name="otp" placeholder="Enter Email OTP" value={formData.otp} onChange={handleChange} required style={{ height: "50px" }} />
                            <button type="button" className="btn btn-outline-danger" onClick={handleVerifyOTP} disabled={!formData.otp}>Verify OTP</button>
                        </div>
                    )}

                    {/* Password */}
                    <div className="mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control ${passwordError ? "is-invalid" : ""}`}
                            name="password"
                            placeholder="Strong Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ height: "50px" }}
                        />
                        {passwordError && (
                            <div className="invalid-feedback" style={{ fontSize: "14px" }}>
                                {passwordError}
                            </div>
                        )}
                    </div>

                    {/* Phone + QR */}
                    <div className="mb-4 d-flex align-items-center">
                        <input type="text" className="form-control me-2" name="phone" placeholder="Phone Number (for Authenticator)" value={formData.phone} onChange={handleChange} required style={{ height: "50px" }} disabled={phoneOtpVerified || qrSent} />
                        <button type="button" onClick={handleGenerateQR} className={`btn ${phoneOtpVerified ? "btn-success" : "btn-outline-danger"}`} disabled={!formData.phone || phoneOtpVerified || qrSent}>
                            {phoneOtpVerified ? "Verified ✅" : "Generate QR"}
                        </button>
                    </div>

                    {/* QR & OTP */}
                    {qrSent && !phoneOtpVerified && (
                        <>
                            {qrSrc && (
                                <div className="mb-3 text-center p-3 border rounded bg-light">
                                    <p className="fw-bold">📱 Scan this QR in Google Authenticator</p>
                                    <img src={qrSrc} alt="QR Code" width="180" height="180" />
                                    <p className="text-muted small">The OTP changes every 30 seconds.</p>
                                </div>
                            )}
                            <div className="mb-4 d-flex align-items-center">
                                <input type="text" className="form-control me-2" name="otp" placeholder="Enter Authenticator OTP" value={formData.otp} onChange={handleChange} required style={{ height: "50px" }} />
                                <button type="button" className="btn btn-danger" onClick={handleVerifyPhoneOTP} disabled={!formData.otp}>Verify Phone</button>
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-danger w-100 mt-3"
                        style={{ height: "50px", fontSize: "18px" }}
                        disabled={!emailVerified || !phoneOtpVerified || !!passwordError}
                    >
                        Signup
                    </button>

                    {/* Login Redirect */}
                    <div className="text-center mt-3">
                        <p>
                            Already signed up?{" "}
                            <span
                                className="text-primary"
                                style={{ cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => navigate("/LoginVictim")}
                            >
                                Login here
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
