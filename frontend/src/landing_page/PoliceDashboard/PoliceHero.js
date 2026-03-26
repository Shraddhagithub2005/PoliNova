import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PoliceHero() {
  const { t } = useTranslation();
  const cards = [
    {
      id: "FIRList",
      title: t("firList"),
      text: t("checkProgressComplaints"),
      img: "../media/images/EducationHero.jpg",
      path: "./",
    },
    {
      id: "ForensicSketch",
      title: t("forensicSketch"),
      text: t("extraResources"),
      img: "../media/images/EducationHero.jpg",
      path: "./ForensicSketch",
    },
    {
      id: "Status",
      title: t("statusTitle"),
      text: t("checkStatus"),
      img: "../media/images/EducationHero.jpg",
      path: "./Status",
    },
    {
      id: "LearnForPolice",
      title: t("learnForPoliceTitle"),
      text: t("extraResources"),
      img: "../media/images/EducationHero.jpg",
      path: "./LearnForPolice",
    },
    {
      id: "LegalAssist",
      title: t("legalAssistantMenu"),
      text: t("askQuestionsGetHelp"),
      img: "../media/images/EducationHero.jpg",
      path: "./LegalAssist",
    },
  ];

  return (
    <div className="container  mt-4">
      <div className="row ">
        {cards.map((card) => (
          <div className="col-md-4 mb-4" id={card.id} key={card.id}>
            <div className="card container-card" style={{ width: "18rem" }}>
              <img src={card.img} className="card-img-top" alt={card.title} />
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.text}</p>
                <Link to={card.path} className="btn btn-primary">
                  {t("goTo", { title: card.title })}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PoliceHero;
