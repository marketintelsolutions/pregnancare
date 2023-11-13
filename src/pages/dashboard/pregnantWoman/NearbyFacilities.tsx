import axios from "axios";
import React, { useEffect, useState } from "react";
import SharedLayout from "../../../components/dashboard/pregnantWoman/SharedLayout";
import { getTimeOfDay } from "../../../utils/dashboardHelpers/getTimeofDay";

const baseUrl = process.env.REACT_APP_BASE_URL;

const NearbyFacilities = () => {
  const [hospitals, setHospitals] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const { lat, lng } = user.coordinates;
    axios
      .post(`${baseUrl}/getNearbyHospitals`, {
        lat: lat,
        lon: lng,
      })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          console.log(data);
          setHospitals(data.hospitals);
        } else {
          console.log("Error finding the closest hospital. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // alert("An error occurred. Please try again later.");
      });
  }, []);

  return (
    <SharedLayout>
      <div className="w-full max-w-[1000px] px-14 py-12 flex flex-col gap-6">
        <section className="justify-between w-full">
          <div className="text-primarytext">
            <h1 className="text-4xl font-bold">
              Hello. <span className="font-normal"> {user.firstname}</span>
            </h1>
            <p className="text-xl mt-2 opacity-80">{getTimeOfDay()}</p>
          </div>
        </section>
        <div className="text-primarytext flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Nearby Healthcare Facilities:</h1>
          {hospitals?.map((hospital, index) => (
            <p
              className="text-base mt-2 opacity-80 border p-4 hover:bg-darkblue hover:text-white transition cursor-pointer"
              key={index}
            >
              {/* <span
                className={` h-fit w-fit bg-${hospital.icon_background_color}`}
              >
                <img
                  src={hospital.icon}
                  alt={hospital.name}
                  className={`bg-${hospital.icon_background_color}`}
                />
              </span>{" "} */}
              {hospital.name} - {hospital.vicinity}
            </p>
          ))}
        </div>
      </div>
    </SharedLayout>
  );
};

export default NearbyFacilities;
