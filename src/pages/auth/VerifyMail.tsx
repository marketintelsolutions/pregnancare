import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/images/background.svg";
import exclaimationRed from "../../assets/logos/exclaimationRed.svg";
import arrowRightWhite from "../../assets/logos/arrowRightWhite.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import axios from "axios";

const VerifyMail = () => {
  const [code, setCode] = useState(Array(5).fill("")); // Array of 5 empty strings
  const [seconds, setSeconds] = useState(60); // Setting initial time to 60 seconds.
  const [showResend, setShowResend] = useState(false);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state?.formData || "";
  //   console.log(email);

  useEffect(() => {
    // Starts the countdown when the component mounts.
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 1) {
          return prevSeconds - 1;
        }
        // Clear the interval when reaching 0 and show the resend option.
        clearInterval(timer);
        setShowResend(true);
        return 0;
      });
    }, 1000);

    inputs.current[0]?.focus();

    // Cleanup: clear the interval when the component unmounts.
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e, idx) => {
    const values = [...code];
    values[idx] = e.target.value;
    setCode(values);

    if (e.target.value && idx < 4) {
      inputs.current[idx + 1].focus();
    }
  };

  const handlePaste = (e, idx) => {
    const pastedData = e.clipboardData.getData("text");
    let values = [...code];

    for (let i = 0; i < 5; i++) {
      if (pastedData[i]) {
        values[idx + i] = pastedData[i];
      }
    }
    setCode(values);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  //   HANDLE SUBMIT
  const handleSubmit = async () => {
    if (!isCodeComplete) {
      // Exit early if the code is not complete
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/verifyCode`,
        {
          code: code.join(""), // sends code as a single string
        }
      );

      // Handle the response data as needed, e.g.
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem("step");

        localStorage.setItem("step", "five");
        navigate("/signup/step-five");
      }
    } catch (error) {
      setError(error.response.data);
      console.error(error.response.data);
    }
  };

  //   RESEND EMAIL CODE
  const handleResend = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/resendCode`,
        {
          email, // sends code as a single string
        }
      );

      // Handle the response data as needed, e.g.
      console.log(response);
    } catch (error) {
      setError(error.response.data);
      console.error(error.response.data);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  const currentStep = localStorage.getItem("step") || "one";

  if (currentStep !== "four")
    return <Navigate to={`/signup/step-${currentStep}`} />;

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
            <h2 className="text-black text-3xl leading-10 font-medium mb-2">
              Confirm your email
            </h2>
            <p className="text-[#383838] text-sm  font-normal">
              To complete your registration, please enter the code that we sent
              to <span className="text-[#0C4C84]">{email}</span>
            </p>
          </article>

          {/* Code Input Boxes */}
          <div className="flex gap-10 justify-center r">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                value={digit}
                maxLength={1}
                className="max-w-[56px] h-[72px] text-center border bg-[#EFEFEF] rounded-xl p-3 text-3xl"
                onChange={(e) => handleInputChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={(e) => handlePaste(e, idx)}
                ref={(ref) => (inputs.current[idx] = ref)}
              />
            ))}
          </div>
          {error && <p className="text-[#FF4D4F]">{error}, Please try again</p>}

          <p className="text-center">
            {showResend ? (
              <span
                className="cursor-pointer text-[#0C4C84]"
                onClick={handleResend}
              >
                Resend Email
              </span>
            ) : (
              `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
                2,
                "0"
              )}`
            )}
          </p>

          <div className="flex gap-3 p-3 bg-[#EEE] rounded-md items-start">
            <img src={exclaimationRed} alt="exclaimationRed" />
            <p>
              If you don’t see our email in your inbox, please check your spam
              folder
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className={`rounded-md py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] flex items-center justify-center gap-2
            ${
              isCodeComplete
                ? "bg-[#3058A6] hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6]"
                : "bg-[#B0B0B0]"
            } 
            transition linear`}
            disabled={!isCodeComplete}
          >
            Proceed <img src={arrowRightWhite} alt="arrowwhite" />
          </button>
        </div>
      </aside>
    </section>
  );
};

export default VerifyMail;
