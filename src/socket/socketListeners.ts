// socketListeners.js
import io from "socket.io-client";
import {
  setDriverAlert,
  setIsDriverAlert,
  setIsNotification,
  setNotifications,
  setSos,
} from "../features/driverSlice";
import { setLatestRide, setUsers } from "../features/healthcareSlice";
import {
  setMessage,
  setDriver,
  setRide,
  setAlert,
  setIsAlert,
} from "../features/userSlice";
// import notificationSound from '../assets/audios/livechat.mp3'

const socket = io(`${process.env.REACT_APP_BASE_URL}`, {
  transports: ["websocket"], // Use only WebSocket transport
});

// const notificationSound = new Audio("../assets/audios/livechat.mp3");

const initializeSocketListeners = (dispatch) => {
  // LISTEN FOR RIDE FROM PATIENT (DRIVER)
  socket.on("updateDrivers", ({ nearbyDrivers, rideDetails }) => {
    const driver = nearbyDrivers[0];

    console.log(rideDetails);

    dispatch(setDriver({ ...driver, rideDetails }));
    dispatch(setSos("new ride"));
    dispatch(setDriverAlert("There is a new ride request"));
    dispatch(setIsDriverAlert(true));

    let notifications = [];

    const notification = {
      message: "there is a new ride request",
    };

    notifications.push(notification);

    dispatch(setNotifications(notifications));
    dispatch(setIsNotification(true));

    // Play notification sound
    // notificationSound.play();
  });

  // LISTEN FOR RIDE ACCEPTED (PATIENT)
  socket.on("acceptRide", (data) => {
    dispatch(setMessage(data.message));
    dispatch(setRide(data.ride));
    dispatch(setDriver(data.ride.assignedDriver));
    dispatch(setAlert("Driver has accepted the ride"));
    dispatch(setIsAlert(true));

    localStorage.setItem("ride", JSON.stringify(data.ride));
  });

  // LISTEN FOR arrive pickup on client (PATIENT)
  socket.on("arrivePickup", (data) => {
    let message;

    if (data.message === "arrivePickup") {
      message = "The driver has arrived, do not keep the driver waiting";
    }

    dispatch(setMessage(message));
    dispatch(setRide(data.ride));
    dispatch(setDriver(data.ride.assignedDriver));
    dispatch(
      setAlert("The Driver has arrived, do not keep the driver waiting")
    );
    dispatch(setIsAlert(true));

    localStorage.setItem("ride", JSON.stringify(data.ride));
  });

  // LISTEN FOR RIDE STARTED (PATIENT)
  socket.on("startTrip", (data) => {
    dispatch(setAlert("Ride started"));
    dispatch(setIsAlert(true));
  });

  // LISTEN FOR ride end (PATIENT)
  socket.on("rideEnded", (data) => {
    dispatch(setMessage(data.message));
    dispatch(setRide(null));
    dispatch(setAlert("The ride has ended"));
    dispatch(setIsAlert(true));

    localStorage.removeItem("ride");
  });

  // LISTEN FOR NEW SOS (HEALTHCARE PROVIDER)
  socket.on("newSos", ({ rideDetails, pregnantWomanUsers }) => {
    dispatch(setUsers(pregnantWomanUsers));
  });

  return () => {
    // Clean up when needed
    if (socket.connected) {
      socket.disconnect();
    }
  };
};

export default initializeSocketListeners;
