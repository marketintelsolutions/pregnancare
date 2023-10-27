import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SharedLayout from "../../../components/dashboard/healthcare/SharedLayout";
import { RootState } from "../../../store/rootReducer";
import car from "../../../assets/logos/car.svg";
import star from "../../../assets/logos/star.svg";
import trip from "../../../assets/logos/trip.svg";
import driverImg from "../../../assets/logos/driver.svg";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import MapHealthcare from "../../../components/dashboard/MapHealthcare";
import {
  setCoordinates,
  setMessage,
  setRide,
  setUser,
} from "../../../features/healthcareSlice";

const UserItem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driver, setDriver] = useState(null);
  const [patient, setPatient] = useState(null);

  const users = useSelector((store: RootState) => store.healthcare.users);
  const user = useSelector((store: RootState) => store.healthcare.user);
  const message = useSelector((store: RootState) => store.healthcare.message);
  const ride = useSelector((store: RootState) => store.healthcare.ride);
  const latestRide = useSelector(
    (store: RootState) => store.healthcare.latestRide
  );

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const API_URL = `${process.env.REACT_APP_BASE_URL}/getUserDetails`;

    axios
      .post(API_URL, { id })
      .then((response) => {
        const user = response.data.user;

        dispatch(setUser(user));
        dispatch(setCoordinates(user.coordinates));

        const sosRideId = user.sosRideId;

        const API_URL = `${process.env.REACT_APP_BASE_URL}/getUserRideDetails`;

        console.log("sosRideId", sosRideId);

        getRideDetails(API_URL, sosRideId);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [users, id]);

  const getRideDetails = (API_URL, sosRideId) => {
    axios
      .post(API_URL, { rideId: sosRideId })
      .then((response) => {
        // console.log(response.data);

        const ride = response.data.ride;
        console.log(ride);

        // dispatch(setUsers(response.data));
        dispatch(setRide(ride));

        if (ride.assignedDriver) {
          console.log("driver assigned");
          setDriver(ride.assignedDriver);
        } else {
          console.log("no driver assigned");
          setMessage("No driver assigned yet");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <SharedLayout>
      <div className="flex mt-10 items-center mx-auto w-fit">
        <MapHealthcare user={user} ride={ride} />
      </div>

      <div className="relative flex flex-col my-8">
        {isModalOpen && (
          <div className="flex flex-row gap-11 bg-none rounded-lg px-12 py-6 absolute bottom-[140%] z-20 mx-auto w-full items-end justify-center">
            {/* DRIVER */}
            {ride?.assignedDriver && (
              <div className="flex flex-col gap-3 rounded-lg px-12 py-6 shadow bottom-[140%] z-20 bg-white">
                <div className="flex items-end">
                  <span>{driver?.name}</span>
                  <img src={driver?.imgUrl} alt="car" />
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
            {/* USER */}
            <div className="flex flex-col gap-3 bg-white rounded-lg px-12 py-6 shadow  z-20">
              <div className="flex items-end">
                <span>{user?.firstname}</span>
                <img src={user?.imgUrl} alt="car" />
              </div>
            </div>
          </div>
        )}
        <>
          <p className="flex gap-2 items-center mx-auto">
            <img src={dangerCircle} alt="dangerCircle" />{" "}
            {ride?.assignedDriver
              ? "15 mins away from pick up point"
              : "no driver assigned"}
          </p>
          <button
            className="w-fit border border-[#3058A6] py-4 px-7 bg-[#3058A6] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear mx-auto"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            {isModalOpen ? `Hide Details` : `Show details`}
          </button>
        </>
      </div>
    </SharedLayout>
  );
};

export default UserItem;
