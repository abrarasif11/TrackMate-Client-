import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch parcels assigned to this rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderParcels", user.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/riders/${user.email}/parcels`
      );
      return res.data;
    },
    enabled: !!user.email,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      const res = await axios.patch(
        `http://localhost:5000/parcels/${parcelId}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["riderParcels", user.email]);
      Swal.fire("Success", "Parcel status updated", "success");
    },
    onError: (err) => {
      Swal.fire("❌ Error", err.message, "error");
    },
  });

  const handleStatusChange = (parcelId, newStatus) => {
    Swal.fire({
      title: `Mark as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ parcelId, status: newStatus });
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        📦 Pending Deliveries
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Parcel</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Sender</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500 italic"
                >
                  🚚 No pending deliveries
                </td>
              </tr>
            ) : (
              parcels.map((parcel, index) => (
                <tr
                  key={parcel._id}
                  className={`border-t transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {parcel.parcelName}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {parcel.parcelName}
                  </td>
                  <td className="px-4 py-3">{parcel.parcelWeight} kg</td>
                  <td className="px-4 py-3">
                    <div>{parcel.senderName}</div>
                    <div className="text-xs text-gray-500">
                      {parcel.senderRegion}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{parcel.receiverName}</div>
                    <div className="text-xs text-gray-500">
                      {parcel.receiverRegion}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {parcel.price}৳
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        parcel.deliveryStatus === "Rider Assigned"
                          ? "bg-yellow-200 text-yellow-900"
                          : parcel.deliveryStatus === "In Transit"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-green-200 text-green-900"
                      }`}
                    >
                      {parcel.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {parcel.deliveryStatus === "Rider Assigned" && (
                      <button
                        onClick={() =>
                          handleStatusChange(parcel._id, "In Transit")
                        }
                        className="px-3 py-1 rounded-md text-sm font-medium bg-[#CAEB66] text-black hover:scale-105 transition shadow"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {parcel.deliveryStatus === "In Transit" && (
                      <button
                        onClick={() =>
                          handleStatusChange(parcel._id, "Delivered")
                        }
                        className="px-3 py-1 rounded-md text-sm font-medium bg-[#CAEB66] text-black hover:scale-105 transition shadow"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeliveries;
