import React from "react";
import {Link} from "react-router-dom";

function PoliceHero() {
  const cards = [
    {
      id: "UserProfile",
      title: "User Profile",
      text: "View and edit your profile information.",
      img: "../media/images/EducationHero.jpg",
      path: "./UserProfile",
    },
    {
      id: "ReportComplaint",
      title: "Report Complaint",
      text: "File a new complaint easily.",
      img: "../media/images/EducationHero.jpg",
      path:"./ReportComplaint",
    },
    {
      id: "CheckStatus",
      title: "Check Status",
      text: "Check the progress of your complaints.",
      img: "../media/images/EducationHero.jpg",
      path: "./CheckStatus",
    },
    {
      id: "ComplaintWithdraw",
      title: "Complaint Withdraw",
      text: "Withdraw a complaint if needed.",
      img: "../media/images/EducationHero.jpg",
      path:"./ComplaintWithdraw",
    },
    {
      id: "Learn",
      title: "Learning",
      text: "Extra resources.",
      img: "../media/images/EducationHero.jpg",
      path:'./Learn',
    },
    {
      id: "Chatbot",
      title: "Chatbot",
      text: "Ask questions and get instant help.",
      img: "../media/images/EducationHero.jpg",
      path: "./Chatbot",
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
                  Go to {card.title}
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
