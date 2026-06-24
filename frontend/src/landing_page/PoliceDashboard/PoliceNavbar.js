import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function PoliceNavbar() {
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
    <>
      <div
        style={{
          position: "fixed",
          top: "70px",
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
        <button className="btn d-flex align-items-center" onClick={toggleSidebar} style={{ fontWeight: "bold" }}>
          <FaHome size={22} className="me-2" />
          {t("policeDashboard")}
        </button>
      </div>

      <div
        className={`shadow ${isOpen ? "d-block" : "d-none"}`}
        style={{
          width: "280px",
          height: "calc(100vh - 130px)",
          position: "fixed",
          top: "130px",
          left: 0,
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          zIndex: 1100,
        }}
      >
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
            {t("policeDashboard")}
            <button className="btn p-0" onClick={toggleSidebar}>
              <FaTimes size={16} />
            </button>
          </li>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard">
            {t("firList")} <FaChevronRight size={14} />
          </Link>

          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/ForensicSketch">
            {t("forensicSketch")} <FaChevronRight size={14} />
          </Link>

         
          <Link className="list-group-item d-flex justify-content-between align-items-center" to="/PoliceDashboard/ContactUs">
            {t("ContactUs")} <FaChevronRight size={14} />
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
    </>
  );
}

export default PoliceNavbar;
