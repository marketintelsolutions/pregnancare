import React, { useState } from "react";
import useFormSubmit from "../../utils/helpers/useFormSubmit";

const DriverForm = () => {
  const initialData = {
    name: "",
    email: "",
    dob: "",
    lno: "",
    address: "",
    sex: "",
    expdate: "",
    genotype: "",
    userType: "driver",
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
          htmlFor="name"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Joseph Jimmy"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">Name is required.</span>
        )}
      </div>
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
          value={formData.email}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required.</span>
        )}
      </div>

      {/* DATE OF BIRTH */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dob"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Date of birth
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="9/10/1989"
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.dob && (
          <span className="text-red-500 text-sm">Dob is required.</span>
        )}
      </div>
      {/* L/NO */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="lno"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          L/NO
        </label>
        <input
          type="text"
          name="lno"
          id="lno"
          placeholder="AASU1219SDSJDSD"
          value={formData.lno}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.lno && (
          <span className="text-red-500 text-sm">L/No is required.</span>
        )}
      </div>
      {/* ADDRESS */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="address"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Address
        </label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Majiro Street"
          value={formData.address}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.address && (
          <span className="text-red-500 text-sm">Address is required.</span>
        )}
      </div>
      {/* SEX*/}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="sex"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Sex
        </label>
        <input
          type="text"
          name="sex"
          id="sex"
          placeholder="male"
          value={formData.sex}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.sex && (
          <span className="text-red-500 text-sm">Sex is required.</span>
        )}
      </div>
      {/* EXP DATE */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="expdate"
          className="text-[#12141D] text-sm font-medium leading-5"
        >
          Exp date
        </label>
        <input
          type="date"
          name="expdate"
          id="expdate"
          placeholder="exp"
          value={formData.expdate}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
        />
        {errors.expdate && (
          <span className="text-red-500 text-sm">Exp. Date is required.</span>
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
          value={formData.genotype}
          onChange={handleChange}
          className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
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

export default DriverForm;
