import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loadingCashout, setLoadingCashout] = useState(false);

  // ✅ fetch completed deliveries
  const { data: parcels = [], isPending } = useQuery({
    queryKey: ["completedParcels", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/riders/${user.email}/parcels?status=Delivered`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ earnings calculation per parcel
  const calculateEarning = (parcel) => {
    if (parcel.senderRegion === parcel.receiverRegion) {
      return (parcel.price * 0.7).toFixed(2);
    } else {
      return (parcel.price * 0.3).toFixed(2);
    }
  };

  // ✅ total earnings
  const totalEarning = parcels.reduce(
    (sum, p) => sum + parseFloat(calculateEarning(p)),
    0
  );

  // ✅ cashout mutation
  const cashoutMutation = useMutation({
    mutationFn: async () => {
      setLoadingCashout(true);
      const res = await axios.post("http://localhost:5000/riders/cashout", {
        riderEmail: user.email,
        amount: totalEarning,
      });
      return res.data;
    },
    onSuccess: () => {
      setLoadingCashout(false);
      Swal.fire("✅ Success", "Cashout request submitted!", "success");
      queryClient.invalidateQueries({
        queryKey: ["completedParcels", user.email],
      });
    },
    onError: (err) => {
      setLoadingCashout(false);
      Swal.fire("❌ Error", err.message, "error");
    },
  });

  const handleCashout = () => {
    if (totalEarning <= 0) {
      Swal.fire(
        "⚠️ No Earnings",
        "You have no earnings to cashout.",
        "warning"
      );
      return;
    }
    Swal.fire({
      title: `Cashout ${totalEarning}৳ ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Cashout",
    }).then((result) => {
      if (result.isConfirmed) {
        cashoutMutation.mutate();
      }
    });
  };

  if (isPending) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        ✅ Completed Deliveries
      </h2>

      {/* Earnings & Cashout */}
      <div className="mb-4 p-4 bg-green-100 rounded-lg shadow flex justify-between items-center">
        <span className="text-green-800 font-semibold">
          Total Earnings: {totalEarning}৳
        </span>
        <button
          onClick={handleCashout}
          disabled={loadingCashout || totalEarning <= 0}
          className={`px-4 py-2 rounded-md text-sm font-medium shadow ${
            totalEarning > 0
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loadingCashout ? "Processing..." : "Cashout"}
        </button>
      </div>

      {/* Deliveries Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Parcel</th>
              <th className="px-4 py-3">Sender</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Earning</th>
              <th className="px-4 py-3">Picked At</th>
              <th className="px-4 py-3">Delivered At</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-8 text-gray-500 italic"
                >
                  📭 No completed deliveries yet
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
                    {parcel.trackingId}
                  </td>
                  <td className="px-4 py-3">{parcel.parcelName}</td>
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
                  <td className="px-4 py-3 font-semibold text-green-700">
                    {calculateEarning(parcel)}৳
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {parcel.pickedAt
                      ? new Date(parcel.pickedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {parcel.deliveredAt
                      ? new Date(parcel.deliveredAt).toLocaleString()
                      : "-"}
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

export default CompletedDeliveries;
