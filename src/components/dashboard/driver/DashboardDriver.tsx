import React, { useEffect } from "react";
import axios from "axios";
import sos from "../../../assets/images/sos.png";
import Map from "../Map";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useDispatch } from "react-redux";
import { setIsPlotted } from "../../../features/mapSlice";
import { fetchDriverDetails } from "../../../utils/helpers/fetchDriver";

const DashboardDriver = () => {
  const user = JSON.parse(localStorage.getItem("driver"));

  const dispatch = useDispatch();

  const isPlotted = useSelector((state: RootState) => state.map.isPlotted);
  const driverDetails = useSelector((state: RootState) => state.driver.driver);
  const ride = useSelector((state: RootState) => state.driver.ride);

  // console.log(ride);

  useEffect(() => {
    if (driverDetails.sos && (ride?.rideId || ride === null)) return;
    // get updated driver details
    // console.log("infinite loop");

    fetchDriverDetails(dispatch);

    // console.log();
  }, [driverDetails]);

  // console.log(ride);

  // USE EFFECT TO REQUEST AND STORE FCM TOKEN
  // useEffect(() => {
  //   requestPermission(user.email);
  // }, []);

  const acceptRide = async () => {
    console.log(ride);
    if (driverDetails.sos) {
      console.log("accept clicked");

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/acceptRide`,
          {
            rideId: ride.rideId,
            driverDetails,
          }
        );

        console.log(response);
        dispatch(setIsPlotted(true));

        // setMessage(response.data.message);
      } catch (error) {
        // setMessage('Error accepting ride.');
        console.log(error);
      }
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
            (driverDetails && driverDetails.sos) || ride
              ? "bg-green-500"
              : "bg-blue-800"
          } text-center z-20 w-[413px] h-[413px] rounded-[42px] flex items-center justify-center cursor-pointer`}
          onClick={acceptRide}
        >
          <div className="text-white mx-auto max-w-[193px]">
            <img src={sos} alt="sos" className="mx-auto mb-2" />
            <p className="italic uppercase text-4xl mb-2"> sos</p>
            <p className="font-normal text-lg">
              {(driverDetails && driverDetails.sos) || ride
                ? "Accept pick up request"
                : "No pick up request"}
            </p>
            {/* <p className="font-normal text-lg">
              {ride ? "Accept pick up request" : "No pick up request"}
            </p> */}
          </div>
        </div>
        {/* {isPlotted ? <MapPlot user={user} /> : <Map user={user} />} */}
        <Map user={user} />
      </div>
    </section>
  );
};

export default DashboardDriver;