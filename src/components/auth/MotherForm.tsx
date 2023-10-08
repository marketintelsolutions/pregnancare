import React, { useState } from "react";
import useFormSubmit from "../../utils/helpers/useFormSubmit";

const MotherForm = () => {
  const initialData = {
    email: "",
    firstname: "",
    age: "",
    children: "",
    pet: "",
    csection: "",
    bloodGroup: "",
    genotype: "",
    userType: "pregnant woman",
  };

  const postURL = `${process.env.REACT_APP_BASE_URL}/saveUser`;

  const {
    formData,
    errors,
    isGeneralError,
    generalError,
    handleChange,
    handleSubmit,
  } = useFormSubmit(initialData, postURL);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* EMAIL */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Enter email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="e.g dayo.abdullahi@gmail.com"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required.</span>
        )}
      </div>
      {/* FIRSTNAME */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="firstname"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Enter firstname
        </label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          placeholder="dayo"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.firstname}
          onChange={handleChange}
        />
        {errors.firstname && (
          <span className="text-red-500 text-sm">Firstname is required.</span>
        )}
      </div>
      {/* AGE */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="age"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Age
        </label>
        <input
          type="number"
          name="age"
          id="age"
          placeholder="28"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && (
          <span className="text-red-500 text-sm">Age is required.</span>
        )}
      </div>
      {/* NUMBER OF CHILDREN */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="children"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Number of children
        </label>
        <input
          type="number"
          name="children"
          id="children"
          placeholder="4"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.children}
          onChange={handleChange}
        />
        {errors.children && (
          <span className="text-red-500 text-sm">Children is required.</span>
        )}
      </div>
      {/* NUMBER OF PET */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="pet"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Number of pet
        </label>
        <input
          type="number"
          name="pet"
          id="pet"
          placeholder="1"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.pet}
          onChange={handleChange}
        />
        {errors.pet && (
          <span className="text-red-500 text-sm">Pet is required.</span>
        )}
      </div>
      {/* NUMBER OF C-SECTION */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="csection"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Number of C-section
        </label>
        <input
          type="number"
          name="csection"
          id="csection"
          placeholder="2"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.csection}
          onChange={handleChange}
        />
        {errors.csection && (
          <span className="text-red-500 text-sm">C-section is required.</span>
        )}
      </div>
      {/* BLOOD GROUP */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="bloodGroup"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Blood group
        </label>
        <input
          type="text"
          name="bloodGroup"
          id="bloodGroup"
          placeholder="A"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.bloodGroup}
          onChange={handleChange}
        />
        {errors.bloodGroup && (
          <span className="text-red-500 text-sm">Blood Group is required.</span>
        )}
      </div>
      {/* GENOTYPE */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="genotype"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Genotype
        </label>
        <input
          type="text"
          name="genotype"
          id="genotype"
          placeholder="AA"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.genotype}
          onChange={handleChange}
        />
        {errors.genotype && (
          <span className="text-red-500 text-sm">Genotype is required.</span>
        )}
      </div>

      {isGeneralError && (
        <span className="text-red-500 text-sm mt-4">
          {generalError || "Complete all required fields."}
        </span>
      )}
      <button
        type="submit"
        className={`rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear `}
      >
        Continue
      </button>
    </form>
  );
};

export default MotherForm;
