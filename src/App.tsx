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
// import { SignupProgressProvider } from "./context/SignupProgress";
import ProtectedRoute from "./components/ProtectedRoute";
import PregnantDashboard from "./pages/dashboard/pregnantWoman/PregnantDashboard";
import DriverDashboard from "./pages/dashboard/driver/DriverDashboard";
import HealthcareDashboard from "./pages/dashboard/healthCare/HealthcareDashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordSteptwo from "./pages/auth/ForgotPasswordSteptwo";
import ForgotPasswordStepthree from "./pages/auth/ForgotPasswordStepthree";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup/step-one" element={<Signup />} />
      <Route path="/signup/step-two" element={<SignupSteptwo />} />
      <Route path="/signup/step-three" element={<SignupStepthree />} />
      <Route path="/signup/step-four" element={<VerifyMail />} />
      <Route path="/signup/step-five" element={<ChoosePassword />} />

      {/* FORGOT PASSWORD */}
      <Route path="/signin/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/signin/forgot-password/step-two"
        element={<ForgotPasswordSteptwo />}
      />
      <Route
        path="/signin/forgot-password/step-three/:token"
        element={<ForgotPasswordStepthree />}
      />

      {/* DASHBOARD */}
      <Route path="/dashboard/pregnant-woman" element={<PregnantDashboard />} />

      <Route path="/dashboard/driver" element={<DriverDashboard />} />
      <Route
        path="/dashboard/healthcare-provider"
        element={<HealthcareDashboard />}
      />

      {/* DASHBOARD */}
    </Routes>
  );
};

export default App;
