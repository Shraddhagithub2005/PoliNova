import React from "react";
import { useTranslation } from "react-i18next";

function Language() {
  const { t } = useTranslation();

  return <h1>{t("languageTitle")}</h1>;
}

export default Language;
