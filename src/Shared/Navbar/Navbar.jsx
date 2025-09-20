import React from "react";
import { Link, NavLink } from "react-router";
import TrackMateLogo from "../TrackMateLogo/TrackMateLogo";
import useAuth from "../../Hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      <li>
        <NavLink to="/sendParcel">Send Parcel</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/beArider">Be a rider</NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar max-w-7xl mx-auto bg-base-100 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <div className="flex  items-center">
          <Link
            to="/"
            className=" font-josefin font-semibold normal-case text-2xl"
          >
            <TrackMateLogo />
          </Link>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {/* <Link className="mr-3 underline text-[#4167F0]" to="/register">
          Register
        </Link> */}
        {user ? (
          <button onClick={handleLogOut} className="btn bg-[#CAEB66] text-black">Log Out</button>
        ) : (
          <Link to="/signin">
            <button className="btn bg-[#CAEB66] text-black">Log In</button>
          </Link>
        )}

        {/* <Link to="/signin">
          <button className="btn bg-[#CAEB66] ml-2 text-black">Log In</button>
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
