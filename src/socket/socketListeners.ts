// socketListeners.js
import io from "socket.io-client";
import { setDriver } from "../features/driverSlice";
import { fetchDriverDetails } from "../utils/helpers/fetchDriver";

const socket = io(`${process.env.REACT_APP_BASE_URL}`, {
  transports: ["websocket"], // Use only WebSocket transport
});

const initializeSocketListeners = (dispatch) => {
  //   console.log("initialised socket");

  // Listen for driver updates
  socket.on("updateDrivers", (updatedDrivers) => {
    const { email } = JSON.parse(localStorage.getItem("driver")) || {};

    console.log("Updated Drivers:", updatedDrivers);

    const driver = updatedDrivers.find((item) => item.email === email);

    // update redux store
    dispatch(setDriver(driver));
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
