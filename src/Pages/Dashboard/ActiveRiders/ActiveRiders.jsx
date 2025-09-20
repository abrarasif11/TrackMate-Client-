import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaUserSlash, FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch active riders with search
  const { isPending, data: riders = [], refetch } = useQuery({
    queryKey: ["activeRiders", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/active${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      return res.data;
    },
  });

  if (isPending) return <Loader />;

  // Deactivate rider
  const handleDeactivate = async (riderId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${riderId}`, { status: "Inactive" });
        Swal.fire("Success!", "Rider deactivated successfully.", "success");
        refetch();
        setSelectedRider(null);
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || err.message,
          "error"
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black">Active Riders</h2>

      {/* Search Input */}
      <div className="mb-4 relative w-full max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {riders.length === 0 ? (
        <p className="text-black">No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Region
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-black font-semibold uppercase text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-black font-semibold uppercase text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr
                  key={rider._id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="px-4 py-3 text-black">{rider.name}</td>
                  <td className="px-4 py-3 text-black">{rider.email}</td>
                  <td className="px-4 py-3 text-black">{rider.contact || "-"}</td>
                  <td className="px-4 py-3 text-black">{rider.region}</td>
                  <td className="px-4 py-3 text-black">{rider.warehouse}</td>
                  <td className="px-4 py-3 text-black">
                    {rider.createdAt
                      ? new Date(rider.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-black capitalize">
                    {rider.status || "Active"}
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    {/* Deactivate / Manage deactivated users */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center hover:opacity-90 transition"
                      onClick={() => handleDeactivate(rider._id)}
                      title="Deactivate"
                    >
                      <FaUserSlash/>  
                      <span className="pl-1"> Deactivate</span> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
            <button
              className="absolute top-3 right-3 text-black text-lg font-bold"
              onClick={() => setSelectedRider(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-black">Rider Details</h3>
            <div className="space-y-2 text-black">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRider.contact || "-"}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>Warehouse:</strong> {selectedRider.warehouse}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{selectedRider.status}</span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedRider.createdAt
                  ? new Date(selectedRider.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              {selectedRider.statusUpdatedAt && (
                <p>
                  <strong>Status Updated At:</strong>{" "}
                  {new Date(selectedRider.statusUpdatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
