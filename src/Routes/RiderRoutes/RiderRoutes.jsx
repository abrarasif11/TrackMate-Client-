import React from "react";
import useUserRole from "../../Hooks/useUserRole";
import useAuth from "../../Hooks/useAuth";

const RiderRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loader />;
  }
  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default RiderRoutes;
