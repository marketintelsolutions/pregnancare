import React, { useState, useEffect } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { setError, setLocation } from "../../features/healthcareSlice";

const mapContainerStyle = {
  width: "866px",
  height: "471px",
};

const center = {
  lat: 40.73061,
  lng: -73.935242, // Default to New York for example purposes
};

// const motherCoord = {
//   lat: 7.45078,
//   lng: 3.89971,
// };
const driverCoord = {
  lat: 7.41809,
  lng: 3.90521,
};

function MapHealthcare({ ride }) {
  const [response, setResponse] = useState(null);

  const location = useSelector((state: RootState) => state.healthcare.location);
  const error = useSelector((state: RootState) => state.healthcare.error);
  const rideDetails = useSelector((state: RootState) => state.user.ride);

  const user = useSelector((state: RootState) => state.healthcare.user);
  const coordinates = useSelector(
    (state: RootState) => state.healthcare.coordinates
  );

  const dispatch = useDispatch();

  const motherCoord = { ...location } || { lat: 0, lng: 0 };
  // const motherCoord = userDetails.patientCoordinates || { lat: 0, lng: 0 };
  // console.log("motherCoord", motherCoord);
  // console.log("driverCoord", driverCoord);

  //   console.log(user);

  // Define your backend endpoint URL
  const BACKEND_URL = `${process.env.REACT_APP_BASE_URL}/saveLocation`;
  const isPlotted = useSelector((state: RootState) => state.map.isPlotted);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(user);

          //   const { lat, lng } =
          //     (ride?.patient && ride?.patient.coordinates) || {};
          //   const lat = user.coordinates.lat;
          //   const lng = user.coordinates.lng;

          const { lat, lng } = coordinates;

          console.log(lat, lng);

          // save location to state
          dispatch(
            setLocation({
              lat,
              lng,
            })
          );

          //   if (!lat || !lng) return;
          //   // Use Geocoding API to get address
          //   fetch(
          //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
          //   )
          //     .then((response) => response.json())
          //     .then((data) => {
          //       if (data.results && data.results[0]) {
          //         const address = data.results[0].formatted_address;
          //         // console.log(address); // log the full address

          //         // Send coordinates and user details to backend
          //         sendCoordinatesToBackend({ lat, lng }, address);
          //       }
          //     })
          //     .catch((err) => console.error("Error fetching address:", err));
        },
        (err) => {
          dispatch(setError(err.message));
        }
      );
    } else {
      dispatch(setError("Geolocation is not supported by this browser."));
    }
  }, [coordinates, user]);

  const sendCoordinatesToBackend = (coordinates, address) => {
    if (!user.email) return;
    axios
      .post(BACKEND_URL, {
        user,
        coordinates,
        address,
      })
      .then((response) => {
        // console.log("Data sent and response received:", response.data);
        // setUserDetails(response.data.user);
      })
      .catch((err) => {
        console.error("Error sending data:", err);
      });
  };

  // USE EFFECT FOR DIRECTIONS SERVICE
  //   useEffect(() => {
  //     console.log("rerendering map");

  //     try {
  //       const directionsService = new google.maps.DirectionsService();
  //       directionsService.route(
  //         {
  //           origin: driverCoord,
  //           destination: motherCoord,
  //           travelMode: google.maps.TravelMode.DRIVING,
  //         },
  //         (result, status) => {
  //           if (status === google.maps.DirectionsStatus.OK) {
  //             setResponse(result);
  //           } else {
  //             console.error(`error fetching directions ${result}`);
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.log(error);
  //       console.log("there was error");
  //     }
  //   }, [ride]);

  return (
    <div className="-ml-6 z-10 w-[866px] h-[471px] rounded-[42px] overflow-hidden opacity-60 mx-auto shadow-mapShadow">
      {error && <p>{error}</p>}
      <LoadScript googleMapsApiKey="AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={location}
        >
          {/* {rideDetails?.status === "accepted"
            ? response && <DirectionsRenderer directions={response} />
            : location && <Marker position={location} />} */}
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapHealthcare;
