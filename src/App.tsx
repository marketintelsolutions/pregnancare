import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import SignupSteptwo from "./pages/auth/SignupSteptwo";
import SignupStepthree from "./pages/auth/SignupStepthree";
import VerifyMail from "./pages/auth/VerifyMail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/step-two" element={<SignupSteptwo />} />
      <Route path="/signup/step-three" element={<SignupStepthree />} />
      <Route path="/signup/verify-email" element={<VerifyMail />} />
    </Routes>
  );
};

export default App;
