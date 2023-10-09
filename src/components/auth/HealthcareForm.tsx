import React from "react";
import useFormSubmit from "../../utils/helpers/useFormSubmit";
import FieldError from "../FieldError";

const HealthcareForm = () => {
  const initialData = {
    hospitalName: "",
    email: "",
    hospitalAddress: "",
    phone: "",
    userType: "healthcare provider",
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
      {/* NAME */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="hospitalName"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Hospital Name
        </label>
        <input
          type="text"
          name="hospitalName"
          id="hospitalName"
          placeholder="Breegs Health"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.hospitalName}
          onChange={handleChange}
        />
        <FieldError
          error={errors.hospitalName}
          text="hospital name is required"
        />
      </div>
      {/* EMAIL */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="e.g dayo.abdullahi@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        <FieldError error={errors.email} text="email is required" />
      </div>
      {/* ADDRESS */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="hospitalAddress"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Address
        </label>
        <input
          type="text"
          name="hospitalAddress"
          id="hospitalAddress"
          placeholder="Majiro Street"
          value={formData.hospitalAddress}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        <FieldError
          error={errors.hospitalAddress}
          text="hospital address is required"
        />
      </div>

      {/* PHONE */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Phone Number
        </label>
        <input
          type="phone"
          name="phone"
          id="phone"
          placeholder="+234703000900"
          value={formData.genotype}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        <FieldError error={errors.phone} text="phone is required" />
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

export default HealthcareForm;
