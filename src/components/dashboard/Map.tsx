import React, { useState, useEffect } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setError } from "../../features/mapSlice";
import { RootState } from "../../store/rootReducer";

// const mapContainerStyle = {
//   width: "559px",
//   height: "471px",
// };

const center = {
  lat: 40.73061,
  lng: -73.935242, // Default to New York for example purposes
};

// const driverCoord = {
//   lat: 7.45078,
//   lng: 3.89971,
// };
const motherCoord = {
  lat: 7.41809,
  lng: 3.90521,
};

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
let directionsService;

function Map({ user }) {
  const dispatch = useDispatch();

  const location = useSelector((state: RootState) => state.map.location);
  const error = useSelector((state: RootState) => state.map.error);
  const ride = useSelector((state: RootState) => state.driver.ride);
  const mapType = useSelector((state: RootState) => state.driver.mapType);
  const closestHospital = useSelector(
    (state: RootState) => state.driver.closestHospital
  );

  const [response, setResponse] = useState(null);
  const [hospitalResponse, setHospitalResponse] = useState(null);
  const [userDetails, setUserDetails] = useState({ patientCoordinates: {} });

  const driverCoord = { ...location } || { lat: 0, lng: 0 };

  let mapWidth = ride !== null ? "866px" : "559px";

  const mapContainerStyle = {
    width: mapWidth,
    height: "471px",
  };

  // Define your backend endpoint URL
  const BACKEND_URL = `${process.env.REACT_APP_BASE_URL}/saveLocation`;
  const isPlotted = useSelector((state: RootState) => state.map.isPlotted);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // save location to state
          dispatch(
            setLocation({
              lat: lat,
              lng: lng,
            })
          );

          // Use Geocoding API to get address
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results[0]) {
                const address = data.results[0].formatted_address;
                // console.log(address); // log the full address

                // Send coordinates and user details to backend
                sendCoordinatesToBackend({ lat, lng }, address);
              }
            })
            .catch((err) => console.error("Error fetching address:", err));
        },
        (err) => {
          dispatch(setError(err.message));
        }
      );
    } else {
      dispatch(setError("Geolocation is not supported by this browser."));
    }
  }, []);

  const sendCoordinatesToBackend = (coordinates, address) => {
    axios
      .post(BACKEND_URL, {
        user,
        coordinates,
        address,
      })
      .then((response) => {
        // console.log("Data sent and response received:", response.data);
        setUserDetails(response.data.user);
      })
      .catch((err) => {
        console.error("Error sending data:", err);
      });
  };

  // USE EFFECT FOR DIRECTIONS SERVICE
  useEffect(() => {
    console.log("ride::", ride);

    try {
      // const directionsService = new google.maps.DirectionsService();
      directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverCoord,
          // origin,
          destination: motherCoord,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      console.log("there was error");
    }
  }, [location, userDetails, ride]);

  // useEffect for directions to hospital
  useEffect(() => {
    if (!closestHospital) return;
    console.log("there is a close hospital");

    let origin = closestHospital;
    console.log("origin", origin);
    console.log("driver coord", driverCoord);

    try {
      // const directionsService = new google.maps.DirectionsService();
      // directionsService.set("directions", null);
      directionsService.route(
        {
          origin,
          destination: motherCoord,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // Clear old directions before setting the new one
            // setResponse(null);
            setHospitalResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      console.log("there was error");
    }
  }, [closestHospital]);

  return (
    <div
      className={`${
        // ride !== null
        ride?.status !== "new" && ride !== null
          ? "z-30 opacity-100 w-[866px] translate-x-[-34%] transition relative"
          : "opacity-60 w-[559px] z-10 static"
      } -ml-10  h-[471px] rounded-[42px] overflow-hidden  transition`}
    >
      {error && <p>{error}</p>}
      <LoadScript googleMapsApiKey={`${API_KEY}`}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={location}
        >
          {ride !== null && ride?.status !== "new"
            ? closestHospital
              ? response && <DirectionsRenderer directions={hospitalResponse} />
              : response && <DirectionsRenderer directions={response} />
            : location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
