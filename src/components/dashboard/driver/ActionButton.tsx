import React from "react";

const ActionButton = ({ ride, driverDetails, handler, text }) => {
  return (
    <button
      className="w-fit border border-red py-4 px-7 bg-[#DB3E4D] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#DB3E4D] transition linear"
      onClick={() => handler(ride, driverDetails)}
    >
      {text}
    </button>
  );
};

export default ActionButton;
