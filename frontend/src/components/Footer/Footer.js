import React from "react";

function Footer() {
  return (
    <div
      className="container-expand-lg border-top"
      style={{ backgroundColor: "brown" }}
    >
      <div className="row mt-2 p-5">
        <div className="col" style={{ marginRight: "20px" }}>
          <img src="media/images/Logo.jpeg" style={{ height:"45px", width: "100px" }} />
          <p>
            <br />
            &copy; Content owned by PoliNova, an initiative towards Smart
            Digital Policing. Site designed and maintained by the PoliNova
            Development Team.
          </p>
          <div>
            <i class="fa fa-twitter p-2" aria-hidden="true"></i>
            <i class="fa fa-facebook-official p-2" aria-hidden="true"></i>
            <i class="fa fa-instagram p-2" aria-hidden="true"></i>
            <i class="fa fa-linkedin-square p-2" aria-hidden="true"></i>
            <i class="fa fa-telegram p-2" aria-hidden="true"></i>
          </div>
        </div>
        <div className="col col-link" style={{ marginRight: "20px" }}>
          <p className="fw-bold">QUICK LINKS</p>
          <a href="" className=" text-decoration-none d-block">
            Home – Explore the latest updates and features of PoliNova.{" "}
          </a>{" "}
          <br />
          <a href="" className=" text-decoration-none d-block">
            About Us – Learn more about the vision and mission behind PoliNova.{" "}
          </a>
          <br />
          <a href="" className=" text-decoration-none d-block">
            Citizen Services – File complaints, track cases, and access public
            reports.{" "}
          </a>
          <br />
          <a href="" className=" text-decoration-none d-block">
            Crime Analytics – View data-driven insights and trends for safer
            communities.
          </a>
          <br />
          <a href="" className=" text-decoration-none d-block">
            Investigation Portal – Secure access for law enforcement officials.{" "}
          </a>
          <br />
          <a href="" className=" text-decoration-none d-block">
            {" "}
            Help & Support – Get assistance and FAQs about using the PoliNova
            platform.{" "}
          </a>
          <br />
          <a href="" className=" text-decoration-none d-block">
            Contact Us – Reach out to the PoliNova support and development team.
          </a>
        </div>
        <div className="col" style={{ marginRight: "20px" }}>
          <p className="fw-bold">REACH US</p>
          <p>
            We are a team of four passionate developers committed to creating a
            smart and citizen-friendly policing platform:
            <br/><b> Shraddha Gaikwad, Shravani Mane,<br/> Komal More, Anagha Kulkarni </b>{" "}
          </p>
          <p>Contact Information:</p>
          <p>
            Office Address: PoliNova Development Hub, 123 Digital Innovation
            Street, Pune, Maharashtra – 411001{" "}
          </p>
        </div>
        <div className="col" style={{ marginRight: "20px" }}>
          <br />
          <br />
          <p>Email: smartfir26@gmail.com</p>
          <p>Phone: +91-8010090577</p>
          <p>Website: www.polinova.com</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
