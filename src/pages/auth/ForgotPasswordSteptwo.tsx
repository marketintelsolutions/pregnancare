import React from "react";
import background from "../../assets/images/background.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import arrowRight from "../../assets/logos/arrowRight.svg";
import exclaimationRed from "../../assets/logos/exclaimationRed.svg";
import { Link, useLocation } from "react-router-dom";
import arrowRightWhite from "../../assets/logos/arrowRightWhite.svg";

const ForgotPasswordSteptwo = () => {
  const location = useLocation();
  console.log(location);
  const email = location.state?.email;

  return (
    <section
      className="bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className="w-[599px] ">
        <div className="py-7 px-14 bg-primary-red flex justify-center rounded-t-lg">
          <Logo aria-label="logo" />
        </div>
        <div className="py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg">
          <article>
            <h2 className="text-black text-3xl leading-10 font-medium">
              Check your inbox
            </h2>
            <p className="text-[#383838] text-sm leading-10 font-normal">
              A link was sent to {email} to reset your password.
            </p>
          </article>
          <Link
            to="/signin"
            type="submit"
            className="rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear flex items-center justify-center gap-2"
          >
            Go back to login <img src={arrowRightWhite} alt="arrowwhite" />
          </Link>

          <div className="flex gap-3 p-3 bg-[#EEE] rounded-md items-start">
            <img src={exclaimationRed} alt="exclaimationRed" />
            <p>
              If you don’t see our email in your inbox, please check your spam
              folder
            </p>
          </div>

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

export default ForgotPasswordSteptwo;
