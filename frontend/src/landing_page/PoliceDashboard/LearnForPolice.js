import React from "react";
import { useTranslation } from "react-i18next";

function LearnForPolice() {
  const { t } = useTranslation();

  return <h1>{t("learnForPoliceTitle")}</h1>;
}

export default LearnForPolice;
