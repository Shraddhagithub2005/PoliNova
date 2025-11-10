import React from 'react';
import { Link } from "react-router-dom";


function Rules_Regulations() {
    return ( 
        <div className="portal-section">
      <h2>Before Filing a Complaint on PoliNova</h2>
      <div className="mt-2 pt-2 " style={{marginRight:"15px" , marginLeft:"15px"}}>
      <p>
        Before proceeding to file a complaint on this portal, please read the following terms and conditions carefully.
      </p>
      <p>
        By submitting this form, I confirm that the information provided is true and accurate to the best of my knowledge. I understand that providing false or misleading details may lead to legal consequences under applicable Indian laws.
      </p>
      <p>
        I acknowledge that the action on complaints submitted through this portal will be undertaken by the relevant law enforcement authorities as per the provisions of Indian law.
      </p>
      <p>
        All complaint The information you submit through PoliNova is handled with care and stored using a secure temporary data storage system. All complaint details are encrypted and maintained only for processing and verification purposes, please review our Privacy Policy.
      </p>
      <p>We sincerely appreciate your trust and cooperation in helping us make reporting easier and more transparent.</p>
      </div>

      <div className="buttons">
        <Link to="/VictimDashboard/MandatoryList" className="btn btn-danger">
         Accept
        </Link>
      </div>
    </div>
     );
}

export default Rules_Regulations;