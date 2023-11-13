import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Map from "../MapMother";
import { RootState } from "../../../store/rootReducer";
import axios from "axios";
import {
  setDriver,
  setIsAlert,
  setLoading,
  setMessage,
  setRide,
} from "../../../features/userSlice";
import sos from "../../../assets/images/sos.png";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import car from "../../../assets/logos/car.svg";
import star from "../../../assets/logos/star.svg";
import trip from "../../../assets/logos/trip.svg";
import driverImg from "../../../assets/logos/driver.svg";
import loader from "../../../assets/images/loadwithoutbg.gif";
import LocationSearch from "../../LocationSearch";
import { getTimeOfDay } from "../../../utils/dashboardHelpers/getTimeofDay";

const Content = ({ user }) => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({ sos: false, sosRideId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const location = useSelector((state: RootState) => state.map.location);
  const message = useSelector((state: RootState) => state.user.message);
  const ride = useSelector((state: RootState) => state.user.ride);
  const loading = useSelector((state: RootState) => state.user.loading);
  const driver = useSelector((state: RootState) => state.user.driver);
  const isAlert = useSelector((state: RootState) => state.user.isAlert);
  const alert = useSelector((state: RootState) => state.user.alert);
  const selectedHospitalCoordinates = useSelector(
    (state: RootState) => state.user.selectedHospitalCoordinates
  );

  console.log("driver", driver);

  const dispatch = useDispatch();

  useEffect(() => {
    if (ride) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/getUserDetails`, {
          email: user.email,
        })
        .then((response) => {
          if (response.data.success) {
            const { user } = response.data;
            // console.log(user.sosRideId);

            let message = user.sos
              ? "SOS Sent"
              : "Click here to request pickup";
            dispatch(setMessage(message));

            if (user.sosRideId) {
              // Move the second axios call here, inside the .then block
              console.log("there is a ride");

              axios
                .post(`${process.env.REACT_APP_BASE_URL}/getUserRideDetails`, {
                  rideId: user.sosRideId,
                })
                .then((rideResponse) => {
                  if (rideResponse.data.success) {
                    const { ride } = rideResponse.data;

                    if (ride.status === "new") {
                      message = "sos sent";
                    } else {
                      message = "ride accepted";
                    }

                    dispatch(setDriver(ride.assignedDriver));
                    dispatch(setRide(ride));
                    dispatch(setMessage(message));
                  } else {
                    setError(rideResponse.data.message);
                  }
                })
                .catch((rideErr) => {
                  console.error("Error fetching ride details:", rideErr);
                  setError("Error fetching ride details. Please try again.");
                });
            }

            setUserDetails(user);

            localStorage.setItem("user", JSON.stringify(user));
          } else {
            setError(response.data.message);
          }
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setError("Error fetching users. Please try again.");
        });

      console.log(ride.status);
    }
  }, [user]);

  // USE EFFECT TO FETCH RIDE
  useEffect(() => {
    // console.log(userDetails);

    if (!userDetails.sosRideId) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getUserRideDetails`, {
        rideId: userDetails.sosRideId,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(setRide(response.data.ride));
          // console.log(response.data.ride);
        } else {
          setError(response.data.message);
        }
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.error("Error fetching ride details:", err);
        setError("Error fetching ride details. Please try again.");
        dispatch(setLoading(false));
      });
  }, [userDetails, message]);

  const fetchNearbyDrivers = (selectedHospital) => {
    dispatch(setLoading(true));

    const coordinates = {
      ...location,
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getNearbyDrivers`, {
        user,
        coordinates,
        selectedHospital,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(setMessage("SOS Sent"));
          setDrivers(response.data.drivers);
          setUserDetails(response.data.user);
          dispatch(setRide(response.data.ride));
        } else {
          setError(response.data.message);
        }
        dispatch(setLoading(false));
        setIsLocationOpen(false);
      })
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        setError("Error fetching drivers. Please try again.");
      });
  };

  return (
    <div className="flex flex-col gap-4 relative w-full  max-w-[1000px]">
      {/* MODAL */}
      {isAlert && (
        <div className="flex flex-col gap-5 bg-[rgba(205,201,201,0.9)] items-center justify-center pt-[200px] pb-[140px] px-[98px]  absolute top-0 left-0 h-full w-full z-[999]">
          <div
            className={` bg-primary-green text-center w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center cursor-pointer `}
          >
            <div className="text-white mx-auto max-w-[193px] flex flex-col gap-3">
              <img src={sos} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2 "> ALERT</p>
              <p className="font-normal text-lg">{alert}</p>
            </div>
          </div>
          <button
            className="w-fit border border-[#3058A6] py-4 px-11 bg-[#3058A6] rounded-md text-white font-bold text-md cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
            onClick={() => dispatch(setIsAlert(false))}
          >
            Close
          </button>
        </div>
      )}

      {/* LOADER */}
      {loading && (
        <div className="flex flex-col gap-5 bg-[rgba(205,201,201,0.7)] items-center justify-center pt-[200px] pb-[140px] px-[98px]  absolute top-0 left-0 h-full w-full z-[999]">
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

      {/* SEARCH BAR */}
      {isLocationOpen && (
        <LocationSearch
          setIsLocationOpen={setIsLocationOpen}
          fetchNearbyDrivers={fetchNearbyDrivers}
        />
      )}

      <section className=" px-14 py-12">
        <div className="text-primarytext">
          <h1 className="text-4xl font-bold">
            Hello. <span className="font-normal"> {user.firstname}</span>
          </h1>
          <p className="text-xl mt-2 opacity-80">{getTimeOfDay()}</p>
        </div>

        <div className="flex mt-10 items-center">
          {/* SOS */}
          <div
            className={` bg-primary-red z-30 text-center w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center cursor-pointer `}
            onClick={() => setIsLocationOpen(true)}
          >
            <div className="text-white mx-auto max-w-[193px] ">
              <img src={sos} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2"> sos</p>
              <p className="font-normal text-lg">{message}</p>
            </div>
          </div>

          {/* MAP */}
          <Map user={user} userDetails={userDetails} ride={ride} />
        </div>
      </section>
      {ride && ride.status !== "new" && (
        <div className="relative flex flex-col gap-5 z-50">
          {/* RIDER MODAL */}
          {isModalOpen && (
            <div className="flex flex-col gap-3 bg-white rounded-lg px-12 py-6 shadow absolute bottom-[140%] z-20">
              <div className="flex items-end">
                <span>{driver.name}</span>
                <img
                  src={driver.imgUrl}
                  alt="car"
                  className="w-[108px] h-[108px] object-cover rounded-full"
                />
              </div>
              <div className="flex items-center">
                <img src={car} alt="car" />
                <span>Toyota Fj Crusier - 5FJXK1</span>
              </div>
              <div className="flex items-center">
                <img src={star} alt="star" />
                <span>Rating - 4.2</span>
              </div>
              <div className="flex items-center">
                <img src={trip} alt="trip" />
                <span>Trips - 2,239</span>
              </div>
              <div className="flex items-center">
                <img src={driverImg} alt="driver" />
                <span>Years - 2</span>
              </div>
            </div>
          )}

          {ride && ride.status !== "new" && (
            <>
              <p className="flex gap-2 items-center mx-auto">
                <img src={dangerCircle} alt="dangerCircle" /> The driver is{" "}
                {ride.duration} away from you
              </p>
              <button
                className="w-fit border border-[#3058A6] py-4 px-7 bg-[#3058A6] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                {isModalOpen
                  ? `Hide Driver Details`
                  : `Click to see driver details`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Content;
