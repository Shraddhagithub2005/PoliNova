import React from "react";
import { Outlet } from "react-router-dom";
import VictimNavbar from "./VictimNavbar";
import ChatWidget from "./ChatWidget";



function VictimDashboard() {
  return (
    <>
      <VictimNavbar />
      <div className="container mt-3">
        <Outlet />
      </div>
      <ChatWidget />
    </>
  );
}

export default VictimDashboard;
