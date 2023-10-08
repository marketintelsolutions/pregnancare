import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import DashboardDriver from "./DashboardDriver";

const DriverDashboard = () => {
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
