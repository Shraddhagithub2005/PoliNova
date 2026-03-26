import React from "react";
import { useTranslation } from "react-i18next";

function LegalAssist() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("legalAssistant")}</h1>
      <p>{t("askLegalQuestions")}</p>
    </div>
  );
}

export default LegalAssist;
