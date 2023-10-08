import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import SignupSteptwo from "./pages/auth/SignupSteptwo";
import SignupStepthree from "./pages/auth/SignupStepthree";
import VerifyMail from "./pages/auth/VerifyMail";
import ChoosePassword from "./pages/auth/ChoosePassword";
import { SignupProgressProvider } from "./context/SignupProgress";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PregnantDashboard from "./pages/dashboard/pregnantWoman/PregnantDashboard";

const App = () => {
  return (
    <SignupProgressProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        {/* <ProtectedRoute path="/signup-step-1" step={1} element={<Signup />} />
        <ProtectedRoute
          path="/signup-step-2"
          step={2}
          element={<SignupSteptwo />}
        />
        <ProtectedRoute
          path="/signup-step-3"
          step={3}
          element={<SignupStepthree />}
        />
        <ProtectedRoute
          path="/verify-email"
          step={4}
          element={<VerifyMail />}
        />
        <ProtectedRoute
          path="/choose-password"
          step={5}
          element={<ChoosePassword />}
        /> */}

        <Route path="/signup/step-one" element={<Signup />} />
        <Route path="/signup/step-two" element={<SignupSteptwo />} />
        <Route path="/signup/step-three" element={<SignupStepthree />} />
        <Route path="/signup/step-four" element={<VerifyMail />} />
        <Route path="/signup/step-five" element={<ChoosePassword />} />

        {/* DASHBOARD */}
        <Route
          path="dashboard/pregnant-woman"
          element={<PregnantDashboard />}
        />
      </Routes>
    </SignupProgressProvider>
  );
};

export default App;
