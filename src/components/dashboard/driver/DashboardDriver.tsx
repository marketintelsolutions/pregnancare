import React, { useState, useEffect } from "react";
import axios from "axios";
import sos from "../../../assets/images/sos.png";
import Map from "../Map";
import MapPlot from "../MapPlot";
import { messaging } from "../../../firebase/firebaseConfig";
import { requestPermission } from "../../../utils/dashboardHelpers/firebaseToken";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";
import { is } from "immer/dist/internal";
import { useDispatch } from "react-redux";
import { setIsPlotted } from "../../../features/mapSlice";

const DashboardDriver = () => {
  const user = JSON.parse(localStorage.getItem("driver"));
  const [driverDetails, setDriverDetails] = useState(null);

  const isPlotted = useSelector((state: RootState) => state.map.isPlotted);
  // console.log(isPlotted);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the driver details from the backend by sending the entire user object
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getDriverDetails`, user)
      .then((response) => {
        setDriverDetails(response.data.driver);
        console.log("driver details:", response.data);
      })
      .catch((err) => {
        console.error("Error fetching driver details:", err);
      });
  }, []);

  // USEEFFECT TO REQUEST AND STORE FCM TOKEN
  useEffect(() => {
    requestPermission(user.email);
  }, []);

  const acceptRide = () => {
    if (driverDetails.sos) {
      console.log("accept clicked");
      // console.log("dense");
      dispatch(setIsPlotted(true));
    }
  };

  // Determine the SOS box's background color and message based on the `sos` status

  return (
    <section className="px-14 py-12">
      <div className="text-primarytext">
        <h1 className="text-4xl font-bold">
          Hello. <span className="font-normal"> {user.name}</span>
        </h1>
        <p className="text-xl mt-2 opacity-80">Good Morning</p>
      </div>

      <div className="flex mt-10 items-center">
        {/* SOS */}
        <div
          className={`${
            driverDetails && driverDetails.sos ? "bg-green-500" : "bg-blue-800"
          } text-center z-20 w-[413px] h-[413px] rounded-[42px] flex items-center justify-center cursor-pointer`}
          onClick={acceptRide}
        >
          <div className="text-white mx-auto max-w-[193px]">
            <img src={sos} alt="sos" className="mx-auto mb-2" />
            <p className="italic uppercase text-4xl mb-2"> sos</p>
            <p className="font-normal text-lg">
              {driverDetails && driverDetails.sos
                ? "Accept pick up request"
                : "No pick up request"}
            </p>
          </div>
        </div>
        {/* {isPlotted ? <MapPlot user={user} /> : <Map user={user} />} */}
        <Map user={user} />
      </div>
    </section>
  );
};

export default DashboardDriver;
