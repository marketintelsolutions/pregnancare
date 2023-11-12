import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import avatar from "../../assets/images/avatar.png";
import dashboard from "../../assets/images/dashboard.png";
import { RootState } from "../../store/rootReducer";

const menuItems = [
  { path: "/dashboard/pregnant-woman", label: "SOS" },
  { path: "/dashboard/pregnant-woman/profile", label: "Profile" },
  {
    path: "/dashboard/pregnant-woman/nearby-facilities",
    label: "Nearby Facilities",
  },
];

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation(); // Get the current location

  // Function to determine if the path matches
  const isActive = (path: string) => location.pathname === path;

  return (
    <section className="w-80 bg-coolblue h-screen px-5">
      <div className="profile flex flex-col items-center gap-11 mt-12">
        <img
          src={user.imgUrl}
          alt="avatar"
          className="w-36 h-36 rounded-full object-cover"
        />

        <nav className="bg-navyblue flex px-5 py-3 flex-col gap-8">
          <div className="flex items-center w-[205px] gap-3">
            <img src={dashboard} alt="dashboard" className="w-6 h-6" />
            <span className="capitalize text-white text-2xl  font-sans">
              dashboard
            </span>
          </div>
          <ul className="flex flex-col items-start gap-[10px] pb-5">
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={`flex gap-3 items-center ${
                  isActive(item.path) ? "text-yellow" : "text-white opacity-60"
                }`}
              >
                <span
                  className={`border ${
                    isActive(item.path) ? "bg-yellow" : "border-[#7F8081]"
                  } w-[10px] h-[10px] rounded-[50%]`}
                ></span>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Sidebar;
