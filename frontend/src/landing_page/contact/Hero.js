import React from "react";

function Hero() {

  const adminContacts = [
    {
      name: "System Administrator",
      phone: "+91 8010090577",
      email: "admin@polinova.com",
      role: "System Management & Access Control"
    },
    {
      name: "Technical Support Team",
      phone: "+91 8010090577",
      email: "support@polinova.com",
      role: "Technical Issues & Bug Support"
    }
  ];

  
  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
    <h1 style={{ color: "#2c3e50",textAlign:"center", marginTop:"10%" }}>Contact Admin</h1>
      <p style={{ textAlign:"center" }}>For system issues or support, please contact admin</p>
    <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          flexWrap: "wrap", // makes it responsive
          marginTop: "5%",
          marginBottom: "10%",
          height: "200px"
        }}
      >
      
       {adminContacts.map((contact, index) => (
    <div 
      key={index} 
      style={{
        background: "#fff",
        padding: "20px",
        width: "500px", // fixed width so they sit side by side
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ color: "brown" }}>{contact.name}</h3>
      <p><strong>Role:</strong> {contact.role}</p>
      <p><strong>Phone:</strong> {contact.phone}</p>
      <p><strong>Email:</strong> {contact.email}</p>


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
</>
  );
}

export default Hero;