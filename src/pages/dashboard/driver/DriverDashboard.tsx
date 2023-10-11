import React from "react";
import Header from "../../../components/dashboard/Header";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardDriver from "../../../components/dashboard/driver/DashboardDriver";
import { Navigate } from "react-router-dom";

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
        {/* <Routes>
          <Route path="/" element={<DashboardDriver />} />
          <Route path="/alert" element={<DashboardDriverTwo />} />
          <Route
            path="/take-ride"
            element={
              <DriverThree
                showPassenger={showPassenger}
                showPassengerDetails={showPassengerDetails}
              />
            }
          />
        </Routes> */}
      </div>
    </>
  );
};

export default DriverDashboard;
