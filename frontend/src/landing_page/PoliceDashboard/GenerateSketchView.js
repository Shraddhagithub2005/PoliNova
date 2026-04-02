import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GenerateSketchView() {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const [suspect, setSuspect] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [variations, setVariations] = useState([]);
    const [promptUsed, setPromptUsed] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/suspect/${complaintId}/`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setSuspect(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [complaintId]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/police/generate-sketch/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaint_id: complaintId })
            });
            const data = await response.json();
            if (data.success) {
                if (data.variations && data.variations.length > 0) {
                    setVariations(data.variations);
                    setPromptUsed(data.prompt);
                    setSelectedImage(null);
                    setSuccessMsg("AI Sketches generated successfully! Please select the most accurate variation.");
                } else {
                    const errorDetails = data.errors && data.errors.length > 0 ? data.errors[0] : "Unknown error";
                    alert(`Generation failed! Backend says: ${errorDetails}`);
                }
            } else {
                alert(data.error || "Generation failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Error generating sketch.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!selectedImage) {
            alert("Please select a variation to save.");
            return;
        }
        try {
            const response = await fetch("http://127.0.0.1:8000/api/police/save-sketch/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    complaint_id: complaintId,
                    selected_url: selectedImage,
                    prompt: promptUsed,
                    officer_id: "Police Officer 1" // Mock officer ID
                })
            });
            const data = await response.json();
            if (data.success) {
                alert("Sketch successfully saved to case file!");
                navigate('/PoliceDashboard/ForensicSketch');
            } else {
                alert(data.error || "Save failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving sketch.");
        }
    };

    if (loading) return <p>Loading suspect details...</p>;
    if (!suspect) return <p>No suspect details found.</p>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
            <h2 style={{ textAlign: "center" }}>AI Sketch Generation (Case #{complaintId})</h2>

            <div style={styles.disclaimerBox}>
                <strong>Accuracy Statement:</strong> The system does not claim the sketch is 100% correct. It generates the most probable visual representation based on witness input. Final verification is always done by police officials. The system is assistive, not autonomous.
            </div>

            <div style={styles.detailsBox}>
                <h4>Suspect Description</h4>
                <p><strong>Gender:</strong> {suspect.gender} | <strong>Age:</strong> {suspect.age}</p>
                <p><strong>Face:</strong> {suspect.faceShape} | <strong>Skin Tone:</strong> {suspect.skinTone}</p>
                <p><strong>Hair:</strong> {suspect.hairType} {suspect.hairColor ? `(${suspect.hairColor})` : ''}</p>
                <p><strong>Other:</strong> {suspect.identifiers || 'None'}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                    onClick={handleGenerate} 
                    style={styles.generateBtn}
                    disabled={generating}
                >
                    {generating ? "Generating AI Variations..." : "Generate AI Variations"}
                </button>
            </div>

            {variations.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    {successMsg && (
                        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
                            <strong>Success:</strong> {successMsg}
                        </div>
                    )}
                    <h3 style={{ textAlign: 'center' }}>Select the Most Accurate Variation</h3>
                    <div style={styles.grid}>
                        {variations.map((url, idx) => {
                            const fullUrl = `http://127.0.0.1:8000${url}`;
                            return (
                                <div 
                                    key={idx} 
                                    style={{
                                        ...styles.imageCard, 
                                        border: selectedImage === fullUrl ? '4px solid green' : '1px solid #ddd'
                                    }}
                                    onClick={() => setSelectedImage(fullUrl)}
                                >
                                    <img src={fullUrl} alt="Variation" style={{ width: '100%', borderRadius: '4px' }} />
                                    <p style={{ textAlign: 'center' }}>Variation {idx + 1}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button 
                            onClick={handleSave} 
                            style={{ ...styles.generateBtn, backgroundColor: selectedImage ? 'green' : 'gray' }}
                            disabled={!selectedImage}
                        >
                            Confirm & Save to Case
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    backBtn: { padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' },
    disclaimerBox: { backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '5px', margin: '20px 0', border: '1px solid #ffeeba' },
    detailsBox: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' },
    generateBtn: { backgroundColor: 'brown', color: 'white', border: 'none', padding: '12px 24px', fontSize: '16px', borderRadius: '5px', cursor: 'pointer' },
    grid: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' },
    imageCard: { padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '220px', transition: '0.3s' }
};

export default GenerateSketchView;
