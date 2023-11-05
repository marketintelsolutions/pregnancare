import React from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";
import { LoadScript } from "@react-google-maps/api";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const SharedLayout = ({ children }) => {
  return (
    <>
      {" "}
      <LoadScript googleMapsApiKey={`${API_KEY}`}>
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
      </LoadScript>
    </>
  );
};

export default SharedLayout;
