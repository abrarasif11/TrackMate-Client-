import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import TrackMateLogo from "../Shared/TrackMateLogo/TrackMateLogo";
import { FaBox, FaMoneyCheckAlt, FaUserEdit } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar lg:hidden bg-base-300 w-full">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 lg:hidden flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet />
        {/* Page content here */}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Logo */}
          <TrackMateLogo />

          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaBox className="w-5 h-5" />
              My Parcels
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaMoneyCheckAlt className="w-5 h-5" />
              My Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/track"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FiMapPin className="w-5 h-5" />
              Track Your Parcel
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive ? "bg-base-300 rounded-lg font-semibold" : ""
                }`
              }
            >
              <FaUserEdit className="w-5 h-5" />
              Update Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
