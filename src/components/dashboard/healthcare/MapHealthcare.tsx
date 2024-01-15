import React, { useState, useEffect } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { setError, setLocation } from "../../../features/healthcareSlice";

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
const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

function MapHealthcare({ user, ride }) {
  const [response, setResponse] = useState(null);

  const location = useSelector((state: RootState) => state.healthcare.location);
  const error = useSelector((state: RootState) => state.healthcare.error);
  const coordinates = useSelector(
    (state: RootState) => state.healthcare.coordinates
  );

  console.log(user);

  console.log("location", location);

  const dispatch = useDispatch();

  const motherCoord = { ...location } || { lat: 0, lng: 0 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = JSON.parse(user && user.coordinates);
          // const lat = user?.coordinates && user.coordinates.lat;
          // const lng = user?.coordinates && user.coordinates.lng;
          const lat = coordinates?.lat;
          const lng = coordinates?.lng;

          console.log("lat lng", lat, lng);

          // save location to state
          coordinates &&
            dispatch(
              setLocation({
                lat,
                lng,
              })
            );
        },
        (err) => {
          dispatch(setError(err.message));
        }
      );
    } else {
      dispatch(setError("Geolocation is not supported by this browser."));
    }
  }, [coordinates, user, user?.coordinates]);

  // USE EFFECT FOR DIRECTIONS SERVICE
  useEffect(() => {
    if (!ride || !ride.assignedDriver) return;
    console.log("rerendering map");

    try {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverCoord,
          destination: motherCoord,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setResponse(result);
            console.log("rerendering complete");
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      console.log("there was error");
    }
  }, [ride, user]);

  return (
    <div className="-ml-6 z-10 w-[866px] h-[471px] rounded-[42px] overflow-hidden opacity-60 mx-auto shadow-mapShadow">
      {error && <p>{error}</p>}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={location}
      >
        {/* <DirectionsRenderer directions={response} /> */}
        {ride?.assignedDriver
          ? response && <DirectionsRenderer directions={response} />
          : location && <Marker position={location} />}
      </GoogleMap>
    </div>
  );
}

export default MapHealthcare;
