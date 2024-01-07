import React, { useState } from "react";
import background from "../../assets/images/background.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import eyeSlash from "../../assets/logos/eyeSlash.svg";
import arrowRight from "../../assets/logos/arrowRight.svg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import arrowRightWhite from "../../assets/logos/arrowRightWhite.svg";
import circle from "../../assets/logos/circle.svg";
import loader from "../../assets/images/loadwithbg.gif";
import checkCircle from "../../assets/logos/checkCircle.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { setUser } from "../../features/userSlice";

interface IPasswordFlag {
  isMinLength: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
}

const ChoosePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFlag, setPasswordFlag] = useState<IPasswordFlag>({
    isMinLength: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Set combined state at once
    setPasswordFlag({
      isMinLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*?]/.test(newPassword),
    });
  };

  const formData = JSON.parse(localStorage.getItem("formData"));
  //   console.log(formData);

  const handleSavePassword = async () => {
    let error = "";

    const allFlagsTrue = Object.values(passwordFlag).every((val) => val);

    if (!termsAccepted) {
      error = "Kindly Agree to the terms";
    }

    if (!allFlagsTrue) {
      error = error
        ? `${error} | Password inputed doesn't meet requirements`
        : "Password inputed doesn't meet requirements";
    }

    if (error) {
      setErrMessage(error);
      return; // Exit early if there's an error.
    }

    if (termsAccepted && allFlagsTrue) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/storePassword`,
          {
            password,
            email: formData.email,
            userType: formData.userType,
          }
        );

        if (response.data.success) {
          console.log(response.data);
          const { user } = response.data;
          const userType = localStorage.getItem("userType");
          setLoading(true);

          // add user to store
          dispatch(setUser(user));

          localStorage.setItem("isAuth", "true");

          setTimeout(() => {
            if (userType === "pregnant woman") {
              setLoading(false);

              localStorage.setItem("user", JSON.stringify(user));
              navigate("/dashboard/pregnant-woman");
            } else if (userType === "driver") {
              setLoading(false);
              localStorage.setItem("driver", JSON.stringify(user));
              navigate("/dashboard/driver");
            } else if (userType === "healthcare provider") {
              localStorage.setItem("healthcareProvider", JSON.stringify(user));
              navigate("/dashboard/healthcare-provider");
            }
          }, 6000);
        } else {
          // Handle any errors e.g. display a message to the user
        }
      } catch (error) {
        console.log(error);
        console.error("Error storing password:", error);
      }
    }
  };

  const currentStep = localStorage.getItem("step") || "one";

  if (currentStep !== "five")
    return <Navigate to={`/signup/step-${currentStep}`} />;

  return (
    <section
      className="bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {loading ? (
        <div className="flex flex-col gap-5 bg-white items-center justify-center pt-[200px] pb-[140px] px-[98px] rounded-xl w-[500px] h-[500px]">
          <img src={loader} alt="loader" className="h-[150px] w-[176px] " />
          <p className="text-2xl leading-8 font-medium text-center text-black">
            Hold on a minute, we are creating your account
          </p>
        </div>
      ) : (
        <aside className="w-[599px] ">
          <div className="py-7 px-14 bg-primary-red flex justify-center rounded-t-lg">
            <Logo aria-label="logo" />
          </div>
          <div className="py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg">
            <article>
              <h2 className="text-black text-3xl leading-10 font-medium">
                Choose your password
              </h2>
              <p className="text-[#383838] text-sm leading-10 font-normal">
                Let's get you started
              </p>
            </article>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[#12141D] text-sm font-medium leading-5"
              >
                Enter your password
              </label>
              <div className="relative ">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="****************"
                  className="rounded-lg p-3 bg-[#F4F4F4] placeholder-[#A8A8A8)] w-full"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <img
                  src={eyeSlash}
                  alt="eyeSlash"
                  className="absolute top-[50%] right-[10px] translate-y-[-12px] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {/* terms and policy */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                className="h-4 w-4"
                checked={termsAccepted}
                onChange={() => setTermsAccepted((prev) => !prev)}
              />
              <label htmlFor="terms">
                I agree to Pregnancare Terms and Privacy Policy.
              </label>
            </div>

            {/* password checkers */}
            <div className="flex items-center flex-wrap gap-3">
              <aside className="flex items-center gap-1">
                <span>
                  <img
                    src={passwordFlag.isMinLength ? checkCircle : circle}
                    alt="validation status"
                  />
                </span>
                <p>Minimum of 8 characters</p>
              </aside>
              <aside className="flex items-center gap-1">
                <span>
                  <img
                    src={passwordFlag.hasUppercase ? checkCircle : circle}
                    alt="validation status"
                  />
                </span>
                <p>One UPPERCASE character</p>
              </aside>
              <aside className="flex items-center gap-1">
                <span>
                  <img
                    src={passwordFlag.hasSpecialChar ? checkCircle : circle}
                    alt="validation status"
                  />
                </span>
                <p>One unique character (e.g: !@#$%^&*?)</p>
              </aside>
            </div>
            {errMessage && (
              <span className="text-danger-red text-sm mt-4">{errMessage}</span>
            )}

            <button
              onClick={handleSavePassword}
              className={`rounded-md py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] flex items-center justify-center gap-2 transition linear bg-[#3058A6]`}
            >
              Proceed <img src={arrowRightWhite} alt="arrowwhite" />
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
      )}
    </section>
  );
};

export default ChoosePassword;
