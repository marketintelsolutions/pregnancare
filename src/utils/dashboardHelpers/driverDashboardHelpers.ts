import axios from "axios";
import {
  setButtonMode,
  setClosestHospital,
  setLoading,
  setMessage,
  setRide,
} from "../../features/driverSlice";
import { setIsPlotted } from "../../features/mapSlice";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const acceptRide = async (driverDetails, dispatch, ride) => {
  console.log("accept clicked");
  if (ride?.status !== "new") return;

  dispatch(setLoading(true));

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/acceptRide`,
      {
        rideId: ride.rideId,
        driverDetails,
      }
    );

    dispatch(setButtonMode("arrivePickup"));
    dispatch(setRide(response.data.ride));
    dispatch(setIsPlotted(true));
    dispatch(setMessage("ride accepted"));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error);
  }
};

export const handleRejectRide = async (ride, driverDetails, dispatch) => {
  dispatch(setLoading(true));

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
      dispatch(setLoading(false));
      dispatch(setRide(null));
      dispatch(setMessage("ride rejected"));
    } else {
      console.error("Failed to reject ride:", response.data.message);
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error("Error rejecting ride:", error);
    dispatch(setLoading(false));
  }
};

export const arrivePickup = async (ride, _, dispatch) => {
  dispatch(setLoading(true));
  console.log("arrived at pickup");
  try {
    // Make a request to the backend route to accept the ride
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/updateRide`,
      {
        rideId: ride.rideId,
        message: "arrivePickup",
      }
    );

    if (response.data.success) {
      console.log("Ride status changed to arrived");
      dispatch(setMessage("arrived at pickup"));

      // move to next button
      dispatch(setButtonMode("startTrip"));
      dispatch(setLoading(false));
    } else {
      console.error("Failed to arrive ride:", response.data.message);
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error("Error arriving ride:", error);
    dispatch(setLoading(false));
  }
};

export const startTrip = async (ride, driverDetails, dispatch) => {
  console.log("starting trip...");
  dispatch(setLoading(true));

  console.log("driverDetails", driverDetails);

  const { lat, lng } = JSON.parse(driverDetails.coordinates);

  if (!lat || !lng) {
    console.log("long and lat of driver is required");
    return;
  }

  try {
    // CALL THIS ROUTE TO FIND THE NEAREST HOSPITAL
    axios
      .post(`${baseUrl}/findClosestHospital`, {
        lat: lat,
        lon: lng,
        rideId: ride.rideId,
      })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          console.log(data.closestHospital);
          let coordinates;

          console.log("ride 2", ride);

          console.log("selected hospital", ride.patient.selectedHospital);

          if (ride.patient.selectedHospital === null) {
            console.log("there is no selected hospital");
            coordinates = data.closestHospital.geometry.location;
          } else {
            console.log("there is a selected hospital");
            coordinates = ride.patient.selectedHospital;
          }

          console.log("hospital coordinates:", coordinates);

          dispatch(setClosestHospital(coordinates));

          // CALL THIS ROUTE TO UPDATE THE STATE OF THE RIDE
          // Make a request to the backend route to accept the ride

          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/updateRide`,
            {
              rideId: ride.rideId,
              message: "startTrip",
            }
          );

          if (response.data.success) {
            console.log("Ride status changed to arrived");
            dispatch(setMessage("arrived at pickup"));

            // move to next button
            dispatch(setButtonMode("endTrip"));
          } else {
            console.error("Failed to arrive ride:", response.data.message);
          }
        } else {
          alert("Error finding the closest hospital. Please try again.");
        }
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error("Error:", error);
        // alert("An error occurred. Please try again later.");
        dispatch(setLoading(false));
      });
  } catch (error) {
    console.error("Error arriving ride:", error);
    dispatch(setLoading(false));
  }
};

export const endTrip = async (ride, _, dispatch) => {
  console.log("ending trip");
  dispatch(setLoading(true));

  try {
    console.log(ride);

    const response = await axios.post(`${baseUrl}/endTrip`, { ride });
    dispatch(setButtonMode("decline"));
    dispatch(setRide(null));
    console.log(response.data);
    dispatch(setLoading(false));
  } catch (error) {
    console.error("Error completing ride:", error);
    dispatch(setLoading(false));
  }
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
  endTrip: {
    color: "#0B9339",
    handler: endTrip,
    text: "Click to end the trip",
  },
};
