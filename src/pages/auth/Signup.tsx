import React from "react";
import background from "../../assets/images/background.svg";
import { ReactComponent as Logo } from "../../assets/logos/whiteLogo.svg";
import googleG from "../../assets/logos/googleG.svg";
import arrowRight from "../../assets/logos/arrowRight.svg";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signup/step-two");
    localStorage.setItem("step", "two");
  };

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
              Welcome to Pregnancare!
            </h2>
            <p className="text-[#383838] text-sm leading-10 font-normal">
              Let's get you logged
            </p>
          </article>

          <button
            onClick={handleLogin}
            className="rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear text-center"
          >
            Sign up with email
          </button>
          <p className="text-center">- or continue with -</p>
          <button className="rounded-md py-3 px-6 text-black text-sm font-medium leading-5 border-[1px] hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear flex items-center gap-2 justify-center">
            <img src={googleG} alt="googleG" /> Google
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

export default Signup;
