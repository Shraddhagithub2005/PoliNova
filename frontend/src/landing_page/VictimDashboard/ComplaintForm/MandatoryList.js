import React from 'react';
import { Link } from "react-router-dom";


function MandatoryList() {
    return ( 
        <>
        <div className="portal-section" style={{marginTop:"15%"}}>
      <h2>Checklist for Complainant</h2>
      <div className="mt-4 pt-3" style={{marginRight:"15px" , marginLeft:"15px"}} >
      <p>
        Please ensure you have the following information ready before filing your complaint on PoliNova. Providing complete and accurate details helps the authorities take timely and effective action.
      </p>
      <p>
       Mandatory Information:
       <ul>
        <li> 1. Date and Time of the Incident</li>
        <li> 2. Detailed Description of the Incident (minimum 200 characters, without using special characters such as #, $, @, ^, *, `, ’’, ~, |, etc.)</li>
        <li> 3. Soft copy of any valid national ID proof (Voter ID, Driving License, Passport, PAN Card, or Aadhaar Card) in .jpeg, .jpg, or .png format (file size not exceeding 5 MB)</li>
        <li> 4. In case of financial or fraud-related complaints, please keep the following ready:
          <ul>
            <li>Name of the Bank / Wallet / Merchant</li>
             <li>Transaction ID / UTR Number</li>
              <li>Date of Transaction</li>
               <li>Amount Involved in the Fraud</li>
          </ul>
        </li>
        <li> 5. Soft copies of all supporting evidence or documents related to the incident (each file not exceeding 10 MB)</li>
       </ul>
      </p>
      <p>
        Optional / Desirable Information
        <ul>
          <li> 1. Links or URLs of suspected websites or social media accounts (if applicable)</li>
          <li> 2. Details of the suspect (if available):
            <ul>
              <li>Mobile Number</li>
              <li>Email ID</li>
              <li>Bank Account Number</li>
              <li>Address</li>
              <li>Soft copy of suspect’s photograph in .jpeg, .jpg, or .png format (file size not exceeding 5 MB)</li>
              <li>Any other documents that can help identify the suspect</li>
            </ul>
          </li>
        </ul>
      </p>
      </div>

      <div className="buttons">
        <Link to="/VictimDashboard/ComplaintForm" className="btn btn-danger">
          Next
        </Link>
      </div>
    </div>
        </>
     );
}

export default MandatoryList;