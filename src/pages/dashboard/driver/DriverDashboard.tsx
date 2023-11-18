import React from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardDriver from "../../../components/dashboard/driver/DashboardDriver";
import { Navigate } from "react-router-dom";
import Header from "../../../components/dashboard/driver/Header";

const DriverDashboard = () => {
  const isAuth = localStorage.getItem("isAuth");

  if (isAuth !== "true") {
    return <Navigate to="/signin" replace />;
  }
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <DashboardDriver />
      </div>
    </>
  );
};

export default DriverDashboard;
