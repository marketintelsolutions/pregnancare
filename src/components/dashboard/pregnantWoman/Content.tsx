import React, { useState } from "react";
import sos from "../../../assets/images/sos.png";
import map from "../../../assets/images/map.png";
// import Map from "../Map";
import Map from "../MapPlot";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";
import axios from "axios";

const Content = ({ user }) => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  const location = useSelector((state: RootState) => state.map.location);
  // console.log("location:", location);

  const fetchNearbyDrivers = () => {
    const userType = "pregnant woman";
    const coordinates = {
      ...location,
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getNearbyDrivers`, {
        userType,
        coordinates,
      })
      .then((response) => {
        if (response.data.success) {
          setError("sos sent");
          setDrivers(response.data.drivers);
          console.log(response.data.drivers);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        setError("Error fetching drivers. Please try again.");
      });
  };

  return (
    <section className="px-14 py-12">
      <div className="text-primarytext">
        <h1 className="text-4xl font-bold">
          Hello. <span className="font-normal"> {user.firstname}</span>
        </h1>
        <p className="text-xl mt-2 opacity-80">Good Morning</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="flex mt-10 items-center">
        {/* SOS */}
        <div
          className="bg-red text-center z-20 w-[413px] h-[413px] rounded-[42px] red-box flex items-center justify-center cursor-pointer"
          onClick={fetchNearbyDrivers}
        >
          <div className="text-white mx-auto max-w-[193px] ">
            <img src={sos} alt="sos" className="mx-auto mb-2" />
            <p className="italic uppercase text-4xl mb-2"> sos</p>
            <p className="font-normal text-lg">
              Click here to request for pick up
            </p>
          </div>
        </div>

        {/* MAP */}
        <Map user={user} />
      </div>
    </section>
  );
};

export default Content;
