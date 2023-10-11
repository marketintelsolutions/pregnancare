import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../../../components/dashboard/Header";
import Content from "../../../components/dashboard/pregnantWoman/Content";
import Sidebar from "../../../components/dashboard/Sidebar";

const PregnantDashboard = () => {
  const isAuth = localStorage.getItem("isAuth");
  const user = JSON.parse(localStorage.getItem("user"));

  if (isAuth !== "true") {
    return <Navigate to="/signin" replace />;
  }
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <Content user={user} />
      </div>
    </>
  );
};

export default PregnantDashboard;
