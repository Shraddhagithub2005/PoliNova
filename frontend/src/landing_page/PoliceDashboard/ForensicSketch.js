import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 

function ForensicSketch() {
    const [suspects, setSuspects] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/suspects/")
            .then(res => res.json())
            .then(data => {
                console.log("Suspects Data:", data); // ✅ DEBUG
                setSuspects(Array.isArray(data) ? data : []); // ✅ safer
            })
            .catch(err => console.error(err));
    }, []);

    const handleGenerate = (complaintId) => {
        console.log("Generating sketch for Complaint ID:", complaintId);

        if (complaintId !== undefined && complaintId !== null) {
            navigate(`/suspect/${complaintId}`);
        } else {
            console.error("Complaint ID is undefined ❌");
            alert("No complaint ID found.");
        }
    };

    return ( 
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{textAlign:"center"}}>Forensic Sketch </h1>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: 'brown',color:"#ddd", textAlign: 'left' }}>
                        <th style={cellStyle}>Complaint ID</th>
                        <th style={cellStyle}>Suspect Details</th>
                        <th style={cellStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {suspects.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={cellStyle}>No suspect data found</td>
                        </tr>
                    ) : (
                        suspects.map((s, index) => {
                            const complaintId = s.complaint_id; // ✅ FIXED KEY

                            console.log("Row Data:", s); // ✅ DEBUG

                            return (
                                <tr key={index}>
                                    <td style={cellStyle}>
                                        {complaintId ? complaintId : "N/A"}
                                    </td>

                                    <td style={cellStyle}>
                                        <button 
                                            onClick={() => {
                                                console.log("View Click ID:", complaintId);

                                                if (complaintId !== undefined && complaintId !== null) {
                                                    navigate(`/suspect/${complaintId}`);
                                                } else {
                                                    console.error("Complaint ID missing ❌", s);
                                                    alert("No complaint ID found for this suspect.");
                                                }
                                            }} 
                                            style={buttonStyle}
                                        >
                                            View
                                        </button>
                                    </td>

                                    <td style={cellStyle}>
                                        <button 
                                            onClick={() => handleGenerate(complaintId)} 
                                            style={buttonStyle}
                                        >
                                            Generate
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

const cellStyle = {
    border: '1px solid #ddd',
    padding: '12px',
};

const buttonStyle = {
    backgroundColor: 'brown',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default ForensicSketch;