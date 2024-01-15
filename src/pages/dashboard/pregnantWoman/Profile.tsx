import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SharedLayout from "../../../components/dashboard/pregnantWoman/SharedLayout";
import { getTimeOfDay } from "../../../utils/dashboardHelpers/getTimeofDay";
import { setUser } from "../../../features/userSlice";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    gender: user.gender || "male",
    dob: user.dob || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    state: user.state || "lagos",
  });
  const [isInputEnabled, setIsInputEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditProfile = async () => {
    setIsInputEnabled(true);

    if (isInputEnabled === false) {
      console.log("input is false");

      return;
    } else {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/update-profile/${user.id}`,
          formData
        );
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
        dispatch(setUser({ ...user, ...formData }));
        setIsInputEnabled(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <SharedLayout>
      <div className="mx-auto w-full px-14 py-12">
        <section className="flex justify-between w-full">
          <div className="text-primarytext">
            <h1 className="text-4xl font-bold">
              Hello. <span className="font-normal"> {user.firstname}</span>
            </h1>
            <p className="text-xl mt-2 opacity-80">{getTimeOfDay()}</p>
          </div>
          {isInputEnabled ? (
            <button
              onClick={handleEditProfile}
              className="px-5 py-2 rounded-md text-white text-[14px] font-medium  bg-[#3058A6] shadow-submitBtn h-[42px]"
            >
              Save changes
            </button>
          ) : (
            <button
              onClick={handleEditProfile}
              className="px-[16px] py-[8px] rounded-sm border border-[#EFEFEF] bg-[#FCFCFC] text-[#1A1D1F] text-[13px] font-normal h-fit"
            >
              Edit Profile
            </button>
          )}
        </section>
        <div className="grid grid-cols-2 mt-14 gap-7">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstname"
              className="text-[#121212] text-[12px] font-normal"
            >
              First name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Robert"
            />
          </div>
          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastname"
              className="text-[#121212] text-[12px] font-normal"
            >
              Last name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            />
          </div>
          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="gender"
              className="text-[#121212] text-[12px] font-normal"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
            >
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
          {/* date of birth */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dob"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              Date of birth
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
            />
          </div>
          {/* email address */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="user@mail.com"
            />
          </div>
          {/* phone number */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              Phone number
            </label>
            <input
              type="phone"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="08062764370"
            />
          </div>
          {/* address */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              address of residence
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            />
          </div>
          {/* state of residence */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="state"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              state of residence
            </label>
            <select
              name="state"
              id="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isInputEnabled}
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            >
              <option value="lagos">Lagos</option>
              <option value="ibadan">Ibadan</option>
            </select>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Profile;
