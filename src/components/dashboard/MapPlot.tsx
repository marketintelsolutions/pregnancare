import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setError } from "../../features/mapSlice";
import { RootState } from "../../app/rootReducer";

const mapContainerStyle = {
  width: "559px",
  height: "471px",
};

const driverCoord = {
  lat: 7.45078,
  lng: 3.89971,
};
const motherCoord = {
  lat: 7.41809,
  lng: 3.90521,
};

function Map({ user }) {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.map.location);
  const error = useSelector((state: RootState) => state.map.error);

  const [response, setResponse] = useState(null);

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
      {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}> */}
      <LoadScript googleMapsApiKey="AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={driverCoord}
        >
          {response && <DirectionsRenderer directions={response} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
