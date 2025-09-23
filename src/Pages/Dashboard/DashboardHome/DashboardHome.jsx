import React from "react";
import useUserRole from "../../../Hooks/useUserRole";
import Loader from "../../../Shared/Loader/Loader";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import ForbiddenPage from "../../ForbiddenPage/ForbiddenPage";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loader />;
  }
  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "rider") return <RiderDashboard />;
  else if (role === "admin") {
    return <AdminDashboard />;
  } else return <ForbiddenPage />;
};
export default DashboardHome;
