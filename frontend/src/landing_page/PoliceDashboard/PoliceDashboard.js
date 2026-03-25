import React from "react";
import { Outlet } from "react-router-dom";
import PoliceNavbar from "./PoliceNavbar";
import ChatWidget from "./ChatWidget";


function PoliceDashboard() {
  return (
    <>
      <PoliceNavbar />
     <div style={{ marginTop: "130px" }}>
  <Outlet />
</div>
      <ChatWidget />
    </>
  );
}

export default PoliceDashboard;
