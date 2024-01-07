import React, { useEffect, useState } from "react";
import useFormSubmit from "../../utils/helpers/useFormSubmit";
import FieldError from "../FieldError";

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
    image: { name: null },
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
        <FieldError error={errors.email} text="email is required" />
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
        <FieldError error={errors.firstname} text="firstname is required" />
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
        <FieldError error={errors.age} text="age is required" />
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
        <FieldError error={errors.children} text="children is required" />
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
        <FieldError error={errors.pet} text="Pet is required" />
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
        <FieldError error={errors.csection} text="csection is required" />
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
        <FieldError error={errors.bloodGroup} text="Blood Group is required" />
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
        <FieldError error={errors.genotype} text="genotype is required" />
      </div>
      {/* IMAGE */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="image"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Profile Picture
        </label>
        <input
          type="file"
          name="image"
          id="image"
          placeholder="AA"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          onChange={handleChange}
          disabled={!formData.email}
        />
        <FieldError error={errors.genotype} text="image is required" />
      </div>

      {isGeneralError && (
        <span className="text-danger-red text-sm mt-4">
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
