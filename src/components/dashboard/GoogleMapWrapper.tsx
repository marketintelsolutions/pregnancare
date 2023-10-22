// // GoogleMapWrapper.tsx
// import React from 'react';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

// interface GoogleMapWrapperProps {
//   google: any; // Add the appropriate type for google
//   zoom: number;
//   initialCenter: {
//     lat: number;
//     lng: number;
//   };
//   markers: any[]; // You can define a type for markers
// }

// const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = (props) => {
//   return (
//     <Map
//       google={props.google}
//       zoom={props.zoom}
//       initialCenter={props.initialCenter}
//     >
//       {props.markers.map((marker, index) => (
//         <Marker
//           key={index}
//           name={marker.name}
//           position={{
//             lat: marker.position.lat,
//             lng: marker.position.lng,
//           }}
//         />
//       ))}
//     </Map>
//   );
// };

// export default GoogleApiWrapper({
//   apiKey: 'YOUR_API_KEY',
// })(GoogleMapWrapper);
