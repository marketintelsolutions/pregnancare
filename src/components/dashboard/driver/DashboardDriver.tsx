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
} from "../../../utils/dashboardHelpers/driverDashboardHelpers";
import ActionButton from "./ActionButton";
import { setIsDriverAlert, setMessage } from "../../../features/driverSlice";

const DashboardDriver = () => {
  const driverDetails = useSelector((state: RootState) => state.driver.driver);
  const ride = useSelector((state: RootState) => state.driver.ride);
  const sos = useSelector((state: RootState) => state.driver.sos);
  const message = useSelector((state: RootState) => state.driver.message);
  const buttonMode = useSelector((state: RootState) => state.driver.buttonMode);
  const loading = useSelector((state: RootState) => state.driver.loading);
  const isDriverAlert = useSelector(
    (state: RootState) => state.driver.isDriverAlert
  );
  const driverAlert = useSelector(
    (state: RootState) => state.driver.driverAlert
  );

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

  // Function to get the time of day
  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <div className="flex items-center flex-col relative w-full">
      {/* MODAL */}
      {isDriverAlert && (
        <div className="flex flex-col gap-5 bg-[rgba(205,201,201,0.9)] items-center justify-center pt-[200px] pb-[140px] px-[98px]  absolute top-0 left-0 h-full w-full z-[999]">
          <div
            className={` bg-primary-green text-center w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center cursor-pointer `}
          >
            <div className="text-white mx-auto max-w-[193px] flex flex-col gap-3">
              <img src={sosImage} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2 "> ALERT</p>
              <p className="font-normal text-lg">{driverAlert}</p>
            </div>
          </div>
          <button
            className="w-fit border border-[#3058A6] py-4 px-11 bg-[#3058A6] rounded-md text-white font-bold text-md cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
            onClick={() => dispatch(setIsDriverAlert(false))}
          >
            Close
          </button>
        </div>
      )}

      {/* LOADER */}
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
          <p className="text-xl mt-2 opacity-80">{getTimeOfDay()}</p>
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
