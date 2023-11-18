import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../store/rootReducer";
import Header from "../../../components/dashboard/pregnantWoman/Header";
import Content from "../../../components/dashboard/pregnantWoman/Content";
import Sidebar from "../../../components/dashboard/Sidebar";
import SharedLayout from "../../../components/dashboard/pregnantWoman/SharedLayout";

const PregnantDashboard = () => {
  const isAuth = localStorage.getItem("isAuth");
  const user = JSON.parse(localStorage.getItem("user"));

  // const user = useSelector((state: RootState) => state.user.user);
  // console.log(user);

  if (isAuth !== "true") {
    return <Navigate to="/signin" replace />;
  }
  return (
    <>
      <SharedLayout>
        <Content user={user} />
      </SharedLayout>
    </>
  );
};

export default PregnantDashboard;
