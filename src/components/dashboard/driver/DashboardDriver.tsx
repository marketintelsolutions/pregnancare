import React, { useEffect } from "react";
import sosImage from "../../../assets/images/sos.png";
import Map from "../Map";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useDispatch } from "react-redux";
import { fetchDriverDetails } from "../../../utils/helpers/fetchDriver";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import loader from "../../../assets/images/loadwithoutbg.gif";
import {
  acceptRide,
  driverButtons,
  handleRejectRide,
} from "../../../utils/dashboardHelpers/driverDashboardHelpers";
import ActionButton from "./ActionButton";
import { setMessage } from "../../../features/driverSlice";

const DashboardDriver = () => {
  const driverDetails = useSelector((state: RootState) => state.driver.driver);
  const ride = useSelector((state: RootState) => state.driver.ride);
  const sos = useSelector((state: RootState) => state.driver.sos);
  const message = useSelector((state: RootState) => state.driver.message);
  const buttonMode = useSelector((state: RootState) => state.driver.buttonMode);
  const loading = useSelector((state: RootState) => state.driver.loading);

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("driver"));

  useEffect(() => {
    let message =
      ride?.status === "new"
        ? "Accept pick up request"
        : ride?.status === "accepted"
        ? "ride accepted"
        : "No pick up request";
    dispatch(setMessage(message));
    console.log(ride);
  }, [ride]);

  useEffect(() => {
    // if (driverDetails.sos && (ride === null || ride?.rideId)) return;
    console.log("new ride gotten");

    console.log(sos);

    fetchDriverDetails(dispatch);
  }, [sos]);

  return (
    <div className="flex items-center flex-col relative w-full">
      {loading && (
        <div className="flex flex-col gap-5 bg-[rgba(205,201,201,0.7)] items-center justify-center pt-[200px] pb-[140px] px-[98px]  absolute top-0 left-0 h-full w-full z-50">
          <img
            src={loader}
            alt="loader"
            className="h-[250px] object-cover w-[276px] rounded-[10%]"
          />
          <p className="text-2xl leading-8 font-medium text-center text-black">
            Hold on a minute...
          </p>
        </div>
      )}
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
              ride?.status === "new" ? "bg-green-500" : "bg-blue-800"
            } text-center z-20 w-[413px] h-[413px] rounded-[42px] flex items-center justify-center cursor-pointer`}
            onClick={async () => {
              // if (message === "ride accepted") return;
              await acceptRide(driverDetails, dispatch, ride);
            }}
          >
            <div className="text-white mx-auto max-w-[193px]">
              <img src={sosImage} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2"> sos</p>
              <p className="font-normal text-lg">{message}</p>
            </div>
          </div>
          <Map user={user} />
        </div>
      </section>
      {message === "ride accepted" && (
        <p className="flex gap-2 items-center mx-auto mb-5">
          <img src={dangerCircle} alt="dangerCircle" />
          {ride?.duration} away from pickup point
        </p>
      )}
      {ride !== null && (
        <ActionButton
          ride={ride}
          driverDetails={driverDetails}
          {...driverButtons[buttonMode]}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};
export default DashboardDriver;
