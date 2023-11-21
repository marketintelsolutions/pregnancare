import React, { useState } from "react";
import logo from "../../../assets/logos/logo.svg";
import notification from "../../../assets/images/notification.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutStates } from "../../../features/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import Lottie from "react-lottie";
import animationData from "../../../assets/animations/notification.json";

const baseUrl = process.env.REACT_APP_BASE_URL;

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Header = () => {
  const ride = useSelector((state: RootState) => state.driver.ride);
  const notifications = useSelector(
    (state: RootState) => state.driver.notifications
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage the visibility of the notification modal
  const [isNotificationModalVisible, setNotificationModalVisibility] = useState(
    false
  );

  const handleLogout = async () => {
    const { email } = JSON.parse(localStorage.getItem("user"));

    try {
      // Make a request to your server to get the user ID based on the email
      const response = await axios.post(`${baseUrl}/logoutDriver`, {
        email,
        ride,
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Logged out successfully");
        // Handle any additional actions after successful logout

        localStorage.removeItem("isAuth");
        localStorage.removeItem("user");
        localStorage.removeItem("driver");
        // localStorage.removeItem("ride");

        dispatch(logoutStates(""));
        navigate("/");
      } else {
        console.error("Logout failed");
        // Handle any error scenarios
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle any network or server error
    }
  };

  return (
    <header className="flex justify-between items-center px-24 py-4 bg-lightblue">
      <Link to="/">
        <img src={logo} alt="logo" className="w-28 h-5" />
      </Link>

      <div className="flex gap-5 items-center">
        <div className="relative">
          {/* <img
            src={notification}
            alt="notification"
            className="w-6 h-6"
            onClick={() =>
              setNotificationModalVisibility(!isNotificationModalVisible)
            }
          /> */}
          <div className="w-8 h-8 relative">
            <Lottie options={lottieOptions} />
            <span className="h-4 w-4 bg-[#FF4D4F] absolute top-0 right-0 text-[9px] text-white flex items-center justify-center rounded-full border-[1.5px] border-white">
              {notifications.length}
            </span>
          </div>
          {/* NOTIFICATION MODAL */}
          {isNotificationModalVisible && (
            <div className="flex flex-col gap-3 bg-white rounded-lg px-12 py-6 shadow absolute top-[200%] z-20 mx-auto w-[290px]">
              <div className="flex">
                <span>NO NOTIFICATIONS</span>
              </div>
              {notifications.map((notification) => {
                return (
                  <div className="flex items-center">
                    <span>Rating - 4.2</span>
                  </div>
                );
              })}
              {/* <div className="flex items-center">
              <span>Toyota Fj Crusier - 5FJXK1</span>
            </div>
            <div className="flex items-center">
              <span>Rating - 4.2</span>
            </div>
            <div className="flex items-center">
              <span>Trips - 2,239</span>
            </div>
            <div className="flex items-center">
              <span>Years - 2</span>
            </div> */}
            </div>
          )}
        </div>
        <div className="rounded-[50%] flex justify-center items-center bg-darkblue w-8 h-8 ">
          <span className="font-bold text-[10px] text-white">AA</span>
        </div>
        <button
          className="bg-primary-red rounded-md px-4 py-2 text-white font-medium"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
