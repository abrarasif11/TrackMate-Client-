import React from "react";
import logo from "../../assets/banner/logo.png";
import { Link } from "react-router";
const TrackMateLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img className="mb-1" src={logo} />
        <p className="text-3xl -ml-2 font-bold">TrackMate</p>
      </div>
    </Link>
  );
};

export default TrackMateLogo;
