import React from "react";
import SharedLayout from "../../../components/dashboard/pregnantWoman/SharedLayout";
import { getTimeOfDay } from "../../../utils/dashboardHelpers/getTimeofDay";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <SharedLayout>
      <div className="w-full max-w-[1000px] px-14 py-12">
        <section className="flex justify-between w-full">
          <div className="text-primarytext">
            <h1 className="text-4xl font-bold">
              Hello. <span className="font-normal"> {user.firstname}</span>
            </h1>
            <p className="text-xl mt-2 opacity-80">{getTimeOfDay()}</p>
          </div>
          <button className="px-[16px] py-[8px] rounded-sm border border-[#EFEFEF] bg-[#FCFCFC] text-[#1A1D1F] text-[13px] font-normal h-fit">
            Edit Profile
          </button>
        </section>
        <div className="grid grid-cols-2 mt-14 gap-7">
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
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Robert"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastname"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              Last name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="gender"
              className="text-[#121212] text-[12px] font-normal"
            >
              {" "}
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            >
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
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
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
            />
          </div>
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
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="user@mail.com"
            />
          </div>
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
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="08062764370"
            />
          </div>
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
              className="border border-[#C6C6C6] bg-[#EEE] text-[16px] placeholder:text-[#717171] leading-6 p-4 rounded w-full"
              placeholder="Miguel"
            />
          </div>
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
