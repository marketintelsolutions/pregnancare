// socketListeners.js
import io from "socket.io-client";
import { setDriver, setSos } from "../features/driverSlice";
import { setLatestRide, setUsers } from "../features/healthcareSlice";
import { setMessage, setRide } from "../features/userSlice";

const socket = io(`${process.env.REACT_APP_BASE_URL}`, {
  transports: ["websocket"], // Use only WebSocket transport
});

const initializeSocketListeners = (dispatch) => {
  //   console.log("initialised socket");

  // LISTEN FOR RIDE FROM PATIENT (DRIVER)
  socket.on("updateDrivers", (updatedDrivers) => {
    const driver = updatedDrivers[0];

    console.log("Updated Driver:", driver);
    dispatch(setDriver(driver));
    dispatch(setSos("new ride"));
  });

  // LISTEN FOR RIDE ACCEPTED (PATIENT)
  socket.on("acceptRide", (data) => {
    console.log("accepted ride", data.ride);
    dispatch(setMessage(data.message));
    dispatch(setRide(data.ride));
    localStorage.setItem("ride", JSON.stringify(data.ride));
  });

  // LISTEN FOR arrive pickup on client (PATIENT)
  socket.on("arrivePickup", (data) => {
    console.log("updated arrived ride", data.ride);

    let message;
    if (data.message === "arrivePickup") {
      message = "The driver has arrived, do not keep the driver waiting";
    }
    dispatch(setMessage(message));
    dispatch(setRide(data.ride));
    localStorage.setItem("ride", JSON.stringify(data.ride));
  });

  // LISTEN FOR NEW SOS (HEALTCARE PROVIDER)
  socket.on("newSos", ({ rideDetails, pregnantWomanUsers }) => {
    // console.log("new sos ride", rideDetails);
    console.log("pregnantWomanUsers", pregnantWomanUsers);

    // dispatch(setLatestRide(rideDetails));
    dispatch(setUsers(pregnantWomanUsers));
  });

  return () => {
    // Clean up when needed
    // socket.disconnect();
    if (socket.connected) {
      socket.disconnect();
    }
  };
};

export default initializeSocketListeners;
