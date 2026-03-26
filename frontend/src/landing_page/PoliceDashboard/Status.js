import React from "react";
import { useTranslation } from "react-i18next";

function Status() {
  const { t } = useTranslation();

  return <h1>{t("statusTitle")}</h1>;
}

export default Status;
