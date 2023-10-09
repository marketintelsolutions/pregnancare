import React from "react";
import Header from "../../../components/dashboard/Header";
import PageOne from "../../../components/dashboard/healthcare/PageOne";
import Sidebar from "../../../components/dashboard/healthcare/Sidebar";

const HealthcareDashboard = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        {/* <Routes>
              <Route path="/" element={<PageOne />} />
              <Route path="/health2" element={<PageTwo />} />
              <Route path="/health3" element={<PageThree />} />
              <Route path="/health4" element={<PageFour />} />
              <Route path="/health5" element={<PageFive />} />
            </Routes> */}
        <PageOne />
      </div>
    </>
  );
};

export default HealthcareDashboard;
