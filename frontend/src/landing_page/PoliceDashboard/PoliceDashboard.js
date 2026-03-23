import React from "react";
import { Outlet } from "react-router-dom";
import PoliceNavbar from "./PoliceNavbar";


function PoliceDashboard() {
  return (
    <>
      <PoliceNavbar />
     <div style={{ marginTop: "130px" }}>
  <Outlet />
</div>
      
    </>
  );
}

export default PoliceDashboard;
