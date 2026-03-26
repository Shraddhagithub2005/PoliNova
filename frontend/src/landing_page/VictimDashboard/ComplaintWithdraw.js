import React from "react";
import { useTranslation } from "react-i18next";

function ComplaintWithdraw() {
  const { t } = useTranslation();

  return <h1>{t("complaintWithdrawTitle")}</h1>;
}

export default ComplaintWithdraw;
