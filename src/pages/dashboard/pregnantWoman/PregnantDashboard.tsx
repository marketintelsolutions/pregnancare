import React from "react";
import Header from "../../../components/dashboard/Header";
import Content from "../../../components/dashboard/pregnantWoman/Content";
import Sidebar from "../../../components/dashboard/Sidebar";

const PregnantDashboard = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <Content />
      </div>
    </>
  );
};

export default PregnantDashboard;
