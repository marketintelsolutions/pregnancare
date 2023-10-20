import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logos/logo.svg";
import woman from "../assets/images/woman.png";
import google from "../assets/images/google.png";
import appStore from "../assets/images/appStore.png";
import { useEffect } from "react";

const Landing = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <section>
      {/* NAVBAR */}
      <nav className="flex justify-between max-w-[1236px] m-auto p-3 bg-white">
        <div className="flex items-center">
          <Logo aria-label="logo" />
        </div>
        <div className="flex gap-5 items-center">
          <Link
            to="/about"
            className="text-black text-center text-base font-medium leading-5"
          >
            About
          </Link>
          <Link
            to="/signin"
            className="text-black text-center text-base font-medium leading-5"
          >
            Sign in
          </Link>
          <Link
            to="/signup/step-one"
            className="py-3 px-5 bg-[#DB3E4D] items-center rounded-md border-none text-white text-base leading-5"
          >
            Create an account
          </Link>
        </div>
      </nav>
      
      {/* CONTENT */}
      <article className="bg-[#3058A6] min-h-screen flex items-center flex-col pt-20 pb-12">
        <div className="scroll-text">
          This Website is under Construction
        </div> <br/> <br/>
        <div className="mb-5">
          <img src={woman} alt="woman" />
        </div>
        <h1 className="text-6xl font-bold text-[#CCF2F0] max-w-[687px] text-center mb-2">
          A grand adventure is about to{" "}
          <span className="text-[#DB3E4D]">BEGIN</span>
        </h1>
        <p className="text-white text-xl leading-7 font-medium mb-12 max-w-[614px] text-center">
          Welcome to our Pregnancy Care site, your go-to resource especially
          during an emergency in transporting a pregnant woman to a health care
          facility by a transporter
        </p>
        <div className="flex gap-5">
          <button>
            <img src={google} alt="google" />
          </button>
          <button>
            <img src={appStore} alt="appStore" />
          </button>
        </div>
      </article>
    </section>
  );
};

export default Landing;
