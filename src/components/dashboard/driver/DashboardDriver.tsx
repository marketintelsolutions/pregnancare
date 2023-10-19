import React, { useEffect, useState } from "react";
import axios from "axios";
import sos from "../../../assets/images/sos.png";
import Map from "../Map";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useDispatch } from "react-redux";
import { setIsPlotted } from "../../../features/mapSlice";
import { fetchDriverDetails } from "../../../utils/helpers/fetchDriver";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import {
  acceptRide,
  driverButtons,
  handleRejectRide,
} from "../../../utils/dashboardHelpers/driverDashboardHelpers";
import ActionButton from "./ActionButton";

const DashboardDriver = () => {
  const driverDetails = useSelector((state: RootState) => state.driver.driver);
  const ride = useSelector((state: RootState) => state.driver.ride);

  const [message, setMessage] = useState(
    (driverDetails && driverDetails.sos) || ride
      ? "Accept pick up request"
      : "No pick up request"
  );

  const dispatch = useDispatch();

  const isPlotted = useSelector((state: RootState) => state.map.isPlotted);
  const buttonMode = useSelector((state: RootState) => state.driver.buttonMode);

  const user = JSON.parse(localStorage.getItem("driver"));

  useEffect(() => {
    if (driverDetails.sos && (ride === null || ride?.rideId)) return;
    fetchDriverDetails(dispatch);
  }, [driverDetails]);

  return (
    <div className="flex items-center flex-col">
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
              (driverDetails && driverDetails.sos) || ride
                ? "bg-green-500"
                : "bg-blue-800"
            } text-center z-20 w-[413px] h-[413px] rounded-[42px] flex items-center justify-center cursor-pointer`}
            onClick={() => {
              if (message === "ride accepted") return;
              acceptRide(driverDetails, dispatch, ride);
              setMessage("ride accepted");
            }}
          >
            <div className="text-white mx-auto max-w-[193px]">
              <img src={sos} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2"> sos</p>
              <p className="font-normal text-lg">{message}</p>
            </div>
          </div>
          <Map user={user} />
        </div>
      </section>

      <p className="flex gap-2 items-center mx-auto mb-5">
        <img src={dangerCircle} alt="dangerCircle" />
        {ride?.duration} away from pickup point
      </p>

      <ActionButton
        ride={ride}
        driverDetails={driverDetails}
        {...driverButtons[buttonMode]}
      />
    </div>
  );
};
export default DashboardDriver;
