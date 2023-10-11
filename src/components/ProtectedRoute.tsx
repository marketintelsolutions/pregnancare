import React from "react";
import { Route, Navigate } from "react-router-dom";
import ForgotPassword from "../pages/auth/ForgotPassword";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth");

  if (isAuth !== "true") {
    return <Navigate to="/" replace />;
  }

  //   return <Route {...rest} element={element} />;
  return children;
};

export default ProtectedRoute;
