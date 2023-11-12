import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const SharedLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export default SharedLayout;
