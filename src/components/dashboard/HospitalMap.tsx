// // HospitalMap.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GoogleMapWrapper from './GoogleMapWrapper'; // Import the wrapper component

// interface HospitalMapProps {
//   // Define any props you need here
// }

// interface Hospital {
//   place_id: string;
//   name: string;
//   geometry: {
//     location: {
//       lat: number;
//       lng: number;
//     };
//   };
// }

// const HospitalMap: React.FC<HospitalMapProps> = () => {
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);

//   useEffect(() => {
//     // Fetch nearby hospitals using the Places API
//     // ...

//     // The rest of the code remains the same
//   }, []);

//   return (
//     <div>
//       <GoogleMapWrapper
//         google={YOUR_GOOGLE_API_OBJECT}
//         zoom={14}
//         initialCenter={{
//           lat: YOUR_LAT,
//           lng: YOUR_LNG,
//         }}
//         markers={hospitals}
//       />
//     </div>
//   );
// };

// export default HospitalMap;
