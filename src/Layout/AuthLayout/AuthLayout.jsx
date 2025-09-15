import React from "react";
import { Outlet } from "react-router";
import authImg from "../../assets/assests/authImage.png";
import TrackMateLogo from "../../Shared/TrackMateLogo/TrackMateLogo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFCF6]">
      {/* Left Section */}
      <div className="flex flex-col px-12 py-8">
        {/* Logo */}
        <div className="mb-8">
          <TrackMateLogo />
        </div>
        {/* Outlet for login/register */}
        <div className="flex items-center justify-center flex-1">
          <Outlet />
        </div>
      </div>

      {/* Right Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-[#FAFCF6]">
        <img
          src={authImg}
          alt="Auth Illustration"
          className="max-w-lg w-full"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
