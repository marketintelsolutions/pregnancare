import axios from "axios";
import { setButtonMode, setRide } from "../../features/driverSlice";
import { setIsPlotted } from "../../features/mapSlice";

export const acceptRide = async (driverDetails, dispatch, ride) => {
  // if (driverDetails.sos) {
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
    //   dispatch(setIsPlotted(true));
    dispatch(setButtonMode("arrivePickup"));
    dispatch(setRide(response.data.ride));
    dispatch(setIsPlotted(true));
    // console.log(response.data.ride);

    // setMessage(response.data.message);
  } catch (error) {
    // setMessage('Error accepting ride.');
    console.log(error);
  }
  // }
};

export const handleRejectRide = async (ride, driverDetails) => {
  console.log(ride?.rideId);

  try {
    // Make a request to the backend route to reject the ride
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/rejectRide`,
      {
        rideId: ride.rideId,
        driverEmail: driverDetails.email,
      }
    );

    if (response.data.success) {
      console.log("Ride rejected successfully");
    } else {
      console.error("Failed to reject ride:", response.data.message);
    }
  } catch (error) {
    console.error("Error rejecting ride:", error);
  }
};

export const arrivePickup = async (ride) => {
  console.log("arrived at pickup");
  try {
    // Make a request to the backend route to reject the ride
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/updateRide`,
      {
        rideId: ride.rideId,
        message: "arrivePickup",
      }
    );

    if (response.data.success) {
      console.log("Ride status changed to arrived");
    } else {
      console.error("Failed to arrive ride:", response.data.message);
    }
  } catch (error) {
    console.error("Error arriving ride:", error);
  }
};

export const startTrip = () => {
  console.log("starting trip");
};

export const driverButtons = {
  decline: {
    color: "#DB3E4D",
    handler: handleRejectRide,
    text: "Decline Request",
  },
  arrivePickup: {
    color: "#3058A6",
    handler: arrivePickup,
    text: "Click to arrive pickup",
  },
  startTrip: {
    color: "#0B9339",
    handler: startTrip,
    text: "Click to start the trip",
  },
};
