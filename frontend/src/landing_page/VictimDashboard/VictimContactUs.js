import React from "react";

function VictimContactUs() {

  const policeContacts = [
    {
      name: "Pune Police Station",
      phone: "+91 8010090577",
      email: "punepolice@gmail.com",
      address: "Shivajinagar, Pune"
    },
    {
      name: "Cyber Crime Cell",
      phone: "+91 8010090577",
      email: "cybercrime@gmail.com",
      address: "Pune Cyber Office"
    }
  ];

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div 
      style={{ 
        marginTop: "5%", 
        textAlign: "center", 
        padding: "30px", 
        backgroundColor: "#f4f7fb", 
        minHeight: "100vh" 
      }}
    >
      
      <h1 style={{ color: "#2c3e50",marginTop:"5%" }}>Contact Police</h1>
      <p>If you need help, reach out to nearby police authorities</p>

      {/* 🔹 First 2 Cards Side by Side */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          flexWrap: "wrap",
          marginTop: "5%",
        }}
      >
        {policeContacts.map((contact, index) => (
          <div 
            key={index} 
            style={{
              background: "#fff",
              padding: "20px",
              width: "400px",
              height: "250px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            <h3 style={{ color: "brown" }}>{contact.name}</h3>
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Address:</strong> {contact.address}</p>

           

            <button 
              onClick={() => handleEmail(contact.email)}
              style={{
                marginLeft: "10px",
                padding: "8px 15px",
                border: "none",
                background: "brown",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Email
            </button>
          </div>
        ))}
      </div>

      <div 
        style={{
          marginTop: "80px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div 
          style={{
            backgroundColor: "#ffe6e6",
            borderLeft: "5px solid red",
            padding: "20px",
            width: "400px",
            height:"200px",
            borderRadius: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Emergency Helpline</h3>
          <p><strong>Call:</strong> 100</p>

          <button 
            onClick={() => handleCall("100")}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              border: "none",
              background: "brown",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Call Emergency
          </button>
        </div>
      </div>

    </div>
  );
}

export default VictimContactUs;