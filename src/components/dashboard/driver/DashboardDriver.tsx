import React from "react";
import sos from "../../../assets/images/sos.png";
import map from "../../../assets/images/map.png";
import Map from "../Map";

const DashboardDriver = () => {
  const user = JSON.parse(localStorage.getItem("driver"));

  return (
    <section className="px-14 py-12">
      <div className="text-primarytext">
        <h1 className="text-4xl font-bold">
          Hello. <span className="font-normal"> {user.name}</span>
        </h1>
        <p className="text-xl mt-2 opacity-80">Good Morning</p>
      </div>

      <div className="flex mt-10 items-center">
        <div className="bg-blue-800 text-center z-20 w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center">
          <div className="text-white mx-auto max-w-[193px]">
            <img src={sos} alt="sos" className="mx-auto mb-2" />
            <p className="italic uppercase text-4xl mb-2"> sos</p>
            <p className="font-normal text-lg">No pick up request</p>
          </div>
        </div>

        {/* <img src={map} alt="map" className="-ml-6 z-10" /> */}
        <Map user={user} />
      </div>
    </section>
  );
};
export default DashboardDriver;
