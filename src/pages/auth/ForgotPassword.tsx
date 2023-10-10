import React, { useState } from "react";
import background from "../../assets/images/background.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import arrowRight from "../../assets/logos/arrowRight.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(validateEmail(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/sendResetEmail`,
        { email }
      );
      setErrorMessage(response.data);
      setTimeout(() => {
        navigate("/signin/forgot-password/step-two", { state: { email } });
      }, 3000);
    } catch (error) {
      console.log(error);
      error.response
        ? setErrorMessage(error.response.data)
        : setErrorMessage("Error sending reset link. Please try again.");
    }
  };

  return (
    <section
      className="bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className="w-[599px] " onSubmit={handleSubmit}>
        <div className="py-7 px-14 bg-primary-red flex justify-center rounded-t-lg">
          <Logo aria-label="logo" />
        </div>
        <div className="py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg">
          <article>
            <h2 className="text-black text-3xl leading-10 font-medium">
              Forgot password?
            </h2>
            <p className="text-[#383838] text-sm leading-10 font-normal">
              Enter the email address you used to register with.
            </p>
          </article>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[#12141D] text-sm font-medium leading-5"
            >
              Enter email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="e.g dayo.abdullahi@gmail.com"
              className={`rounded-lg p-3 placeholder-[#A8A8A8)] ${
                !isValidEmail && email
                  ? "bg-light-red border border-danger-red"
                  : "bg-[#F4F4F4]"
              }`}
            />
            {!isValidEmail && email && (
              <p className="text-red-500 text-xs">Not a valid email address</p>
            )}
          </div>

          <Link
            to="/signin"
            className="text-right text-sm font-medium leading-4 text-[#0C4C84] cursor-pointer"
          >
            Sign in
          </Link>
          {errorMessage && <p>{errorMessage}</p>}
          <button
            type="submit"
            className="rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear"
          >
            Send reset link
          </button>
          <p className="text-center text-sm flex justify-center gap-1">
            Don’t have an account?{" "}
            <Link to="/signup/step-one" className="text-[#0C4C84]">
              Sign up here
            </Link>{" "}
            <span>
              <img src={arrowRight} alt="arrow" />
            </span>
          </p>
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
