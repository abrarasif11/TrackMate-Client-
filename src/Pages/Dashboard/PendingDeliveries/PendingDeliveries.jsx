import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch parcels for the logged-in rider
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["riderParcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/riders/${user.email}/parcels`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!user?.email,
  });

  // Mutation to update parcel status
  const mutation = useMutation(
    async ({ id, status }) =>
      await axios.patch(`/parcels/${id}/status`, { deliveryStatus: status })
  );

  const handleUpdateStatus = async (id, status) => {
    try {
      await mutation.mutateAsync({ id, status });
      Swal.fire("Success", "Parcel status updated", "success");
      queryClient.invalidateQueries(["riderParcels", user.email]);
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load parcels</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Deliveries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Tracking ID</th>
              <th className="px-4 py-2 border">Parcel Name</th>
              <th className="px-4 py-2 border">Sender</th>
              <th className="px-4 py-2 border">Receiver</th>
              <th className="px-4 py-2 border">Weight</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No pending deliveries
                </td>
              </tr>
            )}
            {parcels.map((parcel) => (
              <tr key={parcel._id} className="text-center">
                <td className="px-4 py-2 border">{parcel.trackingId}</td>
                <td className="px-4 py-2 border">{parcel.parcelName}</td>
                <td className="px-4 py-2 border">{parcel.senderName}</td>
                <td className="px-4 py-2 border">{parcel.receiverName}</td>
                <td className="px-4 py-2 border">{parcel.parcelWeight} kg</td>
                <td className="px-4 py-2 border">{parcel.deliveryStatus}</td>
                <td className="px-4 py-2 border">
                  {parcel.deliveryStatus === "Rider Assigned" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(parcel._id, "In Transit")
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Pick Up
                    </button>
                  )}
                  {parcel.deliveryStatus === "In Transit" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(parcel._id, "Delivered")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {parcel.deliveryStatus === "Delivered" && (
                    <span className="text-green-600 font-semibold">
                      Delivered
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeliveries;
