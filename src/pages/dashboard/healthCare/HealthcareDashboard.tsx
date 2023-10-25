import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../../../components/dashboard/Header";
import PageOne from "../../../components/dashboard/healthcare/PageOne";
import SharedLayout from "../../../components/dashboard/healthcare/SharedLayout";
import Sidebar from "../../../components/dashboard/healthcare/Sidebar";

const HealthcareDashboard = () => {
  const isAuth = localStorage.getItem("isAuth");

  if (isAuth !== "true") {
    return <Navigate to="/signin" replace />;
  }
  return (
    <SharedLayout>
      <PageOne />
    </SharedLayout>
  );
};

export default HealthcareDashboard;
