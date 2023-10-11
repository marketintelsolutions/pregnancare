// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const Dashboard = () => {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (err) => {
//           setError(err.message);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   return (
//     <div className="App">
//       {error && <p>{error}</p>}
//       {location && (
//         <MapContainer
//           center={location}
//           zoom={13}
//           style={{ width: "100%", height: "400px" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <Marker position={location}></Marker>
//         </MapContainer>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// src/App.js

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 40.73061,
  lng: -73.935242,
}; // Default to New York for example purposes

function App() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="App">
      {error && <p>{error}</p>}
      <LoadScript googleMapsApiKey="AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={location || center}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
