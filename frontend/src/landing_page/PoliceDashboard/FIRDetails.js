import React from "react";
import { useTranslation } from "react-i18next";

function FIRDetails() {
  const { t } = useTranslation();

  return <h1>{t("firDetails")}</h1>;
}

export default FIRDetails;
