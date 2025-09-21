import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const queryFn = async () => {
    if (!user?.email) return { role: "user" }; // fallback for safety
    try {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      console.log("Role API response:", res.data); // debug: see actual API response
      return res.data; // should be { email, role: "admin" | "rider" | "user" }
    } catch (err) {
      console.error("Failed to fetch role:", err);
      return { role: "user" }; // fallback if API fails
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn,
    enabled: !!user?.email && !authLoading, // wait for user email
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return {
    role: data?.role || "user", // now will correctly return admin if API returns it
    roleLoading: authLoading || isLoading,
    refetch,
  };
};

export default useUserRole;
