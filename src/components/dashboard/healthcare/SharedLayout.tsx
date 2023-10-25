import React from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";

const SharedLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <section className="px-14 py-12 w-full">
          <div className="text-primarytext">
            <h1 className="text-4xl font-bold">
              Hello. <span className="font-normal"> Dayo!</span>
            </h1>
            <p className="text-xl mt-2 opacity-80">Good Morning</p>
          </div>
          {children}
        </section>
      </div>
    </>
  );
};

export default SharedLayout;
