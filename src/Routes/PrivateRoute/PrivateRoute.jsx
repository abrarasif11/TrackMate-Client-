import React from "react";
import Loader from "../../Shared/Loader/Loader";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/signin"  replace/>;
  }

  return children;
};

export default PrivateRoute;
