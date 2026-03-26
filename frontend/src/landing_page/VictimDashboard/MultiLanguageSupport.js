import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function MultiLanguageSupport() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("appLanguage", language);
    setMessage(t("languageSaved"));
  };

  return (
    <div style={{ marginTop: "180px" }}>
      <h1>{t("languageSupport")}</h1>
      <p>{t("selectLanguage")}</p>
      <div className="d-flex gap-3 mt-3">
        <button className="btn btn-outline-danger" onClick={() => handleLanguageChange("en")}>
          {t("english")}
        </button>
        <button className="btn btn-outline-danger" onClick={() => handleLanguageChange("hi")}>
          {t("hindi")}
        </button>
      </div>
      {message ? <p className="mt-3">{message}</p> : null}
    </div>
  );
}

export default MultiLanguageSupport;
