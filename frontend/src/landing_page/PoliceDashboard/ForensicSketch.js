import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 

function ForensicSketch() {
    const [suspects, setSuspects] = useState([]);
    const [viewImage, setViewImage] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/suspects/")
            .then(res => res.json())
            .then(data => {
                setSuspects(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err));
    }, []);

    const handleGenerate = (complaintId) => {
        console.log("Generating sketch for Complaint ID:", complaintId);

        if (complaintId !== undefined && complaintId !== null) {
            navigate(`/PoliceDashboard/generate-sketch/${complaintId}`);
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

                            return (
                                <tr key={index}>
                                    <td style={cellStyle}>
                                        {complaintId ? complaintId : "N/A"}
                                    </td>

                                    <td style={cellStyle}>
                                        <button 
                                            onClick={() => {
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
                                        
                                        {s.sketch_url && (
                                            <button 
                                                onClick={() => setViewImage(`http://127.0.0.1:8000${s.sketch_url}`)} 
                                                style={{...buttonStyle, backgroundColor: '#28a745', marginLeft: '10px'}}
                                            >
                                                View Saved Sketch
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            
            {viewImage && (
                <div style={modalOverlayStyle} onClick={() => setViewImage(null)}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{marginTop: 0}}>Saved Forensic Sketch</h3>
                        <img src={viewImage} alt="Suspect Sketch" style={{maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px'}} />
                        <br/>
                        <button onClick={() => setViewImage(null)} style={{...buttonStyle, backgroundColor: '#333', marginTop: '15px'}}>
                            Close Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', 
    top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '10px', 
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    maxWidth: '500px'
};

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