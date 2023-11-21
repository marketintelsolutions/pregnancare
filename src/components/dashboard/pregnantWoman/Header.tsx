import React from "react";
import logo from "../../../assets/logos/logo.svg";
import notification from "../../../assets/images/notification.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutStates } from "../../../features/userSlice";

const baseUrl = process.env.REACT_APP_BASE_URL;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const { email } = JSON.parse(localStorage.getItem("user"));

    try {
      // Make a request to your server to get the user ID based on the email
      const response = await axios.post(`${baseUrl}/logout`, { email });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Logged out successfully");
        // Handle any additional actions after successful logout

        localStorage.removeItem("isAuth");
        localStorage.removeItem("user");
        localStorage.removeItem("driver");
        localStorage.removeItem("ride");

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
          <img src={notification} alt="notification" className="w-6 h-6" />

          {/* NOTIFICATION */}
          <div className="flex flex-col gap-3 bg-white rounded-lg px-12 py-6 shadow absolute top-[200%] z-20 mx-auto w-[290px]">
            <div className="flex">
              <span>NO NOTIFICATIONS</span>
            </div>
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
