import React, { useState, useEffect } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setError } from "../../features/mapSlice";
import { RootState } from "../../app/rootReducer";

const mapContainerStyle = {
  width: "559px",
  height: "471px",
};

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

function Map({ user }) {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.map.location);
  console.log("location", location);
  const error = useSelector((state: RootState) => state.map.error);
  const [response, setResponse] = useState(null);

  const driverCoord = { ...location };

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
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results[0]) {
                const address = data.results[0].formatted_address;
                console.log(address); // log the full address

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
        console.log("Data sent and response received:", response.data);
      })
      .catch((err) => {
        console.error("Error sending data:", err);
      });
  };

  // USE EFFECT FOR DIRECTIONS SERVICE
  useEffect(() => {
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
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      console.log("there was error");
    }
  }, []);

  return (
    <div className="-ml-6 z-10 w-[559px] h-[471px] rounded-[42px] overflow-hidden opacity-60">
      {error && <p>{error}</p>}
      <LoadScript googleMapsApiKey="AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={location}
        >
          {isPlotted
            ? response && <DirectionsRenderer directions={response} />
            : location && <Marker position={location} />}
        </GoogleMap>
        {/* <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={location || center}
        >
          {location && <Marker position={location} />}
          <Polyline
            path={[driverCoord, motherCoord]}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 2,
              icons: [
                {
                  icon: "SHORT",
                  offset: "0",
                  repeat: "10px",
                },
              ],
            }}
          />
        </GoogleMap> */}
      </LoadScript>
    </div>
  );
}

export default Map;
