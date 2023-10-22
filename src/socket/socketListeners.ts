// socketListeners.js
import io from "socket.io-client";
import { setButtonMode, setDriver, setSos } from "../features/driverSlice";
import { setMessage, setRide } from "../features/userSlice";

const socket = io(`${process.env.REACT_APP_BASE_URL}`, {
  transports: ["websocket"], // Use only WebSocket transport
});

const initializeSocketListeners = (dispatch) => {
  //   console.log("initialised socket");

  // LISTEN FOR RIDE FROM PATIENT
  socket.on("updateDrivers", (updatedDrivers) => {
    // const { email } = JSON.parse(localStorage.getItem("driver")) || {};
    // const driver = updatedDrivers.find((item) => item.email === email);
    // const time = new Date().getMilliseconds();

    const driver = updatedDrivers[0];

    console.log("Updated Driver:", driver);
    // update redux store
    dispatch(setDriver(driver));
    dispatch(setSos("new ride"));
  });

  // LISTEN FOR RIDE ACCEPTED
  socket.on("acceptRide", (data) => {
    console.log("accepted ride", data.ride);
    dispatch(setMessage(data.message));
    dispatch(setRide(data.ride));
    localStorage.setItem("ride", JSON.stringify(data.ride));
  });

  // LISTEN FOR arrive pickup on client
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

  return () => {
    // Clean up when needed
    // socket.disconnect();
    if (socket.connected) {
      socket.disconnect();
    }
  };
};

export default initializeSocketListeners;
