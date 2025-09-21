import useAuth from "../../Hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import useUserRole from "../../Hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loader />;
  }
  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default AdminRoutes;
