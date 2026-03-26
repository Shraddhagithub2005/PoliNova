import React from "react";
import { useTranslation } from "react-i18next";

function Learn() {
  const { t } = useTranslation();

  return <h1>{t("learnTitle")}</h1>;
}

export default Learn;
