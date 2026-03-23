import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

function PoliceNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 🟢 DASHBOARD BAR (Below Main Navbar) */}
      <div
        style={{
          position: "fixed",
          top: "70px", // BELOW main navbar
          left: 0,
          width: "100%",
          height: "60px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          borderBottom: "1px solid #ddd",
          zIndex: 1200,
        }}
      >
        <button
          className="btn d-flex align-items-center"
          onClick={toggleSidebar}
          style={{ fontWeight: "bold" }}
        >
          <FaHome size={22} className="me-2" />
          Police Dashboard
        </button>
      </div>

      {/* 🟣 SIDEBAR */}
      <div
        className={`shadow ${isOpen ? "d-block" : "d-none"}`}
        style={{
          width: "280px",
          height: "calc(100vh - 130px)", // 70 + 60
          position: "fixed",
          top: "130px", // BELOW both bars
          left: 0,
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          zIndex: 1100,
        }}
      >
        <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                      Police Dashboard
                      <button className="btn p-0" onClick={toggleSidebar}>
                        <FaTimes size={16} />
                      </button>
                    </li>

         

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard">
            FIRList <FaChevronRight size={14} />
          </Link>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/ForensicSketch">
            ForensicSketch <FaChevronRight size={14} />
          </Link>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/LegalAssist">
            LegalAssistant <FaChevronRight size={14} /> 
          </Link>
          
           <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/Status">
            Status <FaChevronRight size={14} />
          </Link>

           <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/LearnForPolice">
            Learn <FaChevronRight size={14} />
          </Link>
          {/* Dropdown for Languages */}
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => setShowLanguages(!showLanguages)}
                      style={{ cursor: "pointer" }}
                    >
                      Languages {showLanguages ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                    </li>
          
                    {showLanguages && (
                      <ul className="list-group list-group-flush ms-3">
                        <li className="list-group-item">
                          <Link className="text-decoration-none" to="/VictimDashboard/MultiLanguageSupport">
                            English
                          </Link>
                        </li>
                        <li className="list-group-item">
                          <Link className="text-decoration-none" to="/VictimDashboard/MultiLanguageSupport">
                            Marathi
                          </Link>
                        </li>
                        <li className="list-group-item">
                          <Link className="text-decoration-none" to="/VictimDashboard/MultiLanguageSupport">
                            Hindi
                          </Link>
                        </li>
                      </ul>
                    )}

        </ul>
      </div>
    </>
  );
}

export default PoliceNavbar;
