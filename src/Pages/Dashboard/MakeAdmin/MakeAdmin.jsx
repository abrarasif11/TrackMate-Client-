import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaSearch, FaUserShield, FaUserSlash } from "react-icons/fa";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  // Fetch users by email
  const {
    data: users = [],
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await axiosSecure.get(`/users/search?email=${email}`);
      return res.data;
    },
    enabled: false, // fetch only on search button click
    retry: false,
  });

  // Mutation: update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      Swal.fire("Success", "User role updated", "success");
      queryClient.invalidateQueries(["searchUsers", email]);
    },
    onError: () => Swal.fire("Error", "Failed to update role", "error"),
  });

  // Unified handler for Make Admin / Remove Admin
  const handleRoleChange = (id, role) => {
    updateRoleMutation.mutate({ id, role });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email) return;
    refetch();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Admins</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search users by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          type="submit"
          className="btn bg-[#CAEB66] flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>
      </form>

      {isFetching && <p className="text-gray-500">Searching...</p>}
      {isError && <p className="text-red-500">No users found.</p>}

      {/* Users List */}
      {users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-green-200 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                {user.role !== "admin" ? (
                  <button
                    onClick={() => handleRoleChange(user._id, "admin")}
                    className="btn bg-green-600  ml-2 mt-2  text-white flex items-center gap-2"
                  >
                    <FaUserShield /> Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(user._id, "user")}
                    className="btn bg-red-500 text-white flex items-center gap-2"
                  >
                    <FaUserSlash /> Remove Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
