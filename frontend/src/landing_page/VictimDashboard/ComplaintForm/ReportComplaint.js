import React from "react";
import { Link } from "react-router-dom";
import "./ReportComplaint.css";

function ReportComplaint() {
  return (
  <>
  <div className="portal-section">
      <h2>Filing a Complaint on PoliNova</h2>
      <div className="mt-4 pt-3" style={{marginRight:"15px" , marginLeft:"15px"}} >
      <p >
        PoliNova is an online platform developed to help citizens easily report crimes and track complaint progress through a single, user-friendly portal. This initiative aims to bridge the gap between citizens and law enforcement agencies, ensuring transparency and quick action in handling reported cases.
      </p>
      <p>
       This portal caters to complaints related to general crimes, cyber offences, and public safety issues, with a focus on enhancing communication between users and local police authorities. Complaints submitted  to the PoliNova departments based on the information provided by the complainant.
      </p>

      <p>
        It is important to enter accurate and complete details while submitting a report to ensure timely response and proper investigation.
      </p>
      <p>
        For emergencies or situations requiring immediate police assistance, please contact your nearest police station or use the following helpline numbers:
      </p>
      </div>
      <br/>

      <ul>
        <li>National Police Helpline: 112</li>
        <li>Women Safety Helpline: 181</li>
        <li>Cyber Crime Helpline: 1930</li>
      </ul>

      <div className="buttons">
        <Link to="/VictimDashboard/Rules_Regulations" className="btn btn-danger">
          File a Complaint
        </Link>
      </div>
    </div>
 
  </>  
  );
}

export default ReportComplaint;

