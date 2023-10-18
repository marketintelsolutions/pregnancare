import React, { useEffect, useState } from "react";
import sos from "../../../assets/images/sos.png";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import Map from "../MapMother";
// import Map from "../MapPlot";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMessage, setRide } from "../../../features/userSlice";

const Content = ({ user }) => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({ sos: false, sosRideId: "" });

  const rideDetails = useSelector((state: RootState) => state.user.ride);
  const message = useSelector((state: RootState) => state.user.message);
  // const driver = useSelector((state: RootState) => state.driver.driver);

  const ride = JSON.parse(localStorage.getItem("ride")) || {};

  const driver = ride.assignedDriver || {};

  const dispatch = useDispatch();

  const location = useSelector((state: RootState) => state.map.location);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getUserDetails`, {
        email: user.email,
      })
      .then((response) => {
        if (response.data.success) {
          const { user } = response.data;

          setUserDetails(user);
          localStorage.setItem("user", JSON.stringify(user));
          dispatch(setRide(user.ride));

          const message = user.sos
            ? rideDetails.status === "accepted"
              ? "Ride accepted"
              : "SOS Sent"
            : "Click here to request pickup";

          console.log(message);

          dispatch(setMessage(message));
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Error fetching users. Please try again.");
      });
  }, [user]);

  // USE EFFECT TO FETCH RIDE
  useEffect(() => {
    console.log(userDetails);

    if (!userDetails.sosRideId) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getUserRideDetails`, {
        rideId: userDetails.sosRideId,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(setRide(response.data.ride));
          console.log(response.data.ride);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching ride details:", err);
        setError("Error fetching ride details. Please try again.");
      });
  }, [userDetails, message]);

  const fetchNearbyDrivers = () => {
    // if (user.sos === true) return;
    console.log("fetching drivers");

    const userType = "pregnant woman";
    const coordinates = {
      ...location,
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getNearbyDrivers`, {
        user,
        coordinates,
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
      })
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        setError("Error fetching drivers. Please try again.");
      });
  };

  return (
    <div className="flex items-center flex-col gap-4">
      <section className="px-14 py-12">
        <div className="text-primarytext">
          <h1 className="text-4xl font-bold">
            Hello. <span className="font-normal"> {user.firstname}</span>
          </h1>
          <p className="text-xl mt-2 opacity-80">Good Morning</p>
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
        </div>

        <div className="flex mt-10 items-center">
          {/* SOS */}
          <div
            className="bg-red text-center z-20 w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center cursor-pointer"
            onClick={fetchNearbyDrivers}
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
      {ride.status === "accepted" && (
        <div>
          <p className="flex gap-2 items-center">
            <img src={dangerCircle} alt="dangerCircle" /> The driver is 15 mins
            away to you
          </p>
          <button
            className="w-fit border border-[#3058A6] py-4 px-7 bg-[#3058A6] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
            // onClick={handleRejectRide}
          >
            Click to see drivers details {driver.email}
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;
