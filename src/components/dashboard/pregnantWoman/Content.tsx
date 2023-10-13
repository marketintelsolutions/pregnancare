import React, { useEffect, useState } from "react";
import sos from "../../../assets/images/sos.png";
import map from "../../../assets/images/map.png";
import Map from "../MapMother";
// import Map from "../MapPlot";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";
import axios from "axios";

const Content = ({ user }) => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("Click here to request pickup");

  const [userDetails, setUserDetails] = useState({ sos: false });

  const location = useSelector((state: RootState) => state.map.location);
  // console.log("location:", location);

  // console.log(user);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getUserDetails`, {
        email: user.email,
      })
      .then((response) => {
        if (response.data.success) {
          setUserDetails(response.data.user);

          console.log(response.data.user);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Error fetching users. Please try again.");
      });
  }, [user]);

  const fetchNearbyDrivers = () => {
    if (user.sos) return;
    const userType = "pregnant woman";
    const coordinates = {
      ...location,
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getNearbyDrivers`, {
        user,
        coordinates,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage("SOS Sent");
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
        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
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
              {userDetails.sos ? "SOS Sent" : "Click here to request pickup"}
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
