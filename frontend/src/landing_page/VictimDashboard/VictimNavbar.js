import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function VictimNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("appLanguage", language);
    setShowLanguages(false);
  };

  return (
    <div>
      <nav
        className="navbar-light shadow-sm mt-5"
        style={{
          position: "fixed",
          top: "10px",
          left: 0,
          width: "100%",
          height: "70px",
          zIndex: 1000,
          background: "white",
        }}
      >
        <button
          className="btn d-flex align-items-center"
          onClick={toggleSidebar}
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          <FaHome size={22} className="me-2" />
          <h4 style={{ fontSize: "20px", margin: 0 }}>{t("victimDashboard")}</h4>
        </button>
      </nav>

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
            {t("victimDashboard")}
            <button className="btn p-0" onClick={toggleSidebar}>
              <FaTimes size={16} />
            </button>
          </li>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/VictimDashboard">
            {t("userProfile")} <FaChevronRight size={14} />
          </Link>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/VictimDashboard/ReportComplaint">
            {t("reportComplaint")} <FaChevronRight size={14} />
          </Link>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/VictimDashboard/CheckStatus">
            {t("checkStatus")} <FaChevronRight size={14} />
          </Link>

          {/* <Link className="list-group-item d-flex justify-content-between align-items-center" to="/VictimDashboard/ComplaintWithdraw">
            {t("complaintWithdraw")} <FaChevronRight size={14} />
          </Link> */}

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/VictimDashboard/VictimContactUs">
            {t("Contact Us")} <FaChevronRight size={14} />
          </Link>

          

          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => setShowLanguages(!showLanguages)}
            style={{ cursor: "pointer" }}
          >
            {t("languages")} {showLanguages ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
          </li>

          {showLanguages && (
            <ul className="list-group list-group-flush ms-3">
              <li className="list-group-item">
                <button className="text-decoration-none border-0 bg-transparent p-0" onClick={() => changeLanguage("en")}>
                  {t("english")}
                </button>
              </li>
              <li className="list-group-item">
                <button className="text-decoration-none border-0 bg-transparent p-0" onClick={() => changeLanguage("en")}>
                  {t("marathi")}
                </button>
              </li>
              <li className="list-group-item">
                <button className="text-decoration-none border-0 bg-transparent p-0" onClick={() => changeLanguage("hi")}>
                  {t("hindi")}
                </button>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
}

export default VictimNavbar;
