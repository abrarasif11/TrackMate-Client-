import React from "react";
import logo from "../../assets/banner/logo.png";
const TrackMateLogo = () => {
  return (
    <div className="flex items-end">
      <img className="mb-1" src={logo} />
      <p className="text-3xl -ml-2 font-bold">TrackMate</p>
    </div>
  );
};

export default TrackMateLogo;
