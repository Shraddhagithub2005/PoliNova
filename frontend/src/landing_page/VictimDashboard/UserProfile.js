import React from "react";
import { useTranslation } from "react-i18next";

function UserProfile() {
  const { t } = useTranslation();

  return <h1>{t("userProfileCompleted")}</h1>;
}

export default UserProfile;
