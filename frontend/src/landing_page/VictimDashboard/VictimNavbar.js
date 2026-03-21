import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

function VictimNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="navbar-light shadow-sm mt-5">
        <button
          className="btn d-flex align-items-center"
          onClick={toggleSidebar}
          style={{ fontWeight: "bold" }}
        >
          <FaHome size={22} className="me-2" />
          <h4 style={{ fontSize: "20px", margin: 0 }}>Victim Dashboard</h4>
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`shadow ${isOpen ? "d-block" : "d-none"}`}
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 70,
          backgroundColor: "#fff",
          transition: "all 0.3s ease",
          zIndex: 1100,
          paddingTop: "13px",
          borderRight: "1px solid #ddd",
        }}
      >
        <ul className="list-group list-group-flush ">
          <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
            Victim Dashboard
            <button className="btn p-0" onClick={toggleSidebar}>
              <FaTimes size={16} />
            </button>
          </li>

          {/* Menu Items */}
          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard"   // ✅ goes to UserProfile by default
          >
            User Profile <FaChevronRight size={14} />
          </Link>

          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard/ReportComplaint"
          >
            Report Complaint <FaChevronRight size={14} />
          </Link>

          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard/CheckStatus"
          >
            Check Status <FaChevronRight size={14} />
          </Link>

          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard/ComplaintWithdraw"
          >
            Complaint Withdraw <FaChevronRight size={14} />
          </Link>

          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard/Learn"
          >
            Learn <FaChevronRight size={14} />
          </Link>

          <Link
            className="list-group-item d-flex justify-content-between align-items-center"
            to="/VictimDashboard/Chatbot"
          >
            Chatbot <FaChevronRight size={14} />
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
    </div>
  );
}

export default VictimNavbar;
