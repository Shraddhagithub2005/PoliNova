import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom "
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        zIndex: 1300,
        backgroundColor: "brown"
        
      }}
    >
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">
          <img
            src="media/images/Logo.jpeg"
            alt="Logo"
            style={{height:"45px", width: "100px", marginLeft: "20px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

          {/* Left Links */}
          <div className="navbar-nav">
            <Link className="nav-link" to="/" style={{ backgroundColor: "brown",color:"white" }}>Home</Link>
            <Link className="nav-link" to="/AboutPage" style={{ backgroundColor: "brown",color:"white" }}>About</Link>
            <Link className="nav-link" to="/ContactPage" style={{ backgroundColor: "brown",color:"white" }}>Contact</Link>

            <div className="nav dropdown">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                style={{ backgroundColor: "brown",color:"white" }}
              >
                Select Role
              </button>

              <ul className="dropdown-menu" style={{ backgroundColor: "brown" }}>
                <li><Link className="dropdown-item" to="/Signup" style={{ backgroundColor: "brown",color:"white" }} >Victim</Link></li>
                <li><Link className="dropdown-item" to="/LoginPolice" style={{ backgroundColor: "brown",color:"white" }}>Police</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Side Logout */}
          <div className="ms-auto">
            <Link className="btn " to="/Logout"
            style={{backgroundColor:"brown", color:"white"}}>
              Logout
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;