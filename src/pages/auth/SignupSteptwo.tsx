import React, { useState } from "react";
import background from "../../assets/images/background.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import arrowRight from "../../assets/logos/arrowRight.svg";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignupSteptwo = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedOption) {
      localStorage.removeItem("step");

      localStorage.setItem("step", "three");
      localStorage.setItem("userType", `${selectedOption}`);
      navigate(`/signup/step-three`, { state: { option: selectedOption } });
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const currentStep = localStorage.getItem("step") || "one";

  // if (currentStep !== "two")
  //   return <Navigate to={`/signup/step-${currentStep}`} />;

  return (
    <section
      className="bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <aside className="w-[599px] ">
        <div className="py-7 px-14 bg-primary-red flex justify-center rounded-t-lg">
          <Logo aria-label="logo" />
        </div>
        <div className="py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg">
          <article>
            <h2 className="text-black text-3xl leading-10 font-medium">
              Sign up
            </h2>
            <p className="text-[#383838] text-sm leading-10 font-normal">
              Let's get you logged
            </p>
          </article>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="mode"
              className="text-[#12141D] text-sm font-medium leading-5"
            >
              Select option
            </label>
            <select
              name="mode"
              id="mode"
              className="border border-[#C6C6C6] rounded-md p-4"
              onChange={handleOptionChange}
              value={selectedOption}
            >
              <option value="">-- Select an Option --</option>
              <option value="pregnant woman">Pregnant Woman</option>
              <option value="driver">Driver</option>
              <option value="healthcare provider">Health Care Provider</option>
            </select>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedOption}
            className={`rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm text-center font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear ${
              !selectedOption ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue
          </button>
          <p className="text-center text-sm flex justify-center gap-1">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#0C4C84]">
              {" "}
              Login here
            </Link>{" "}
            <span>
              <img src={arrowRight} alt="arrow" />
            </span>
          </p>
        </div>
      </aside>
    </section>
  );
};

export default SignupSteptwo;
