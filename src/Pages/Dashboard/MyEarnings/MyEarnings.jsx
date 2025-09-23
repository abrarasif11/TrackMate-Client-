import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import { FaDollarSign } from "react-icons/fa";
import { format, isThisWeek, isToday, isThisMonth, isThisYear } from "date-fns";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("overall"); // today, week, month, year, overall

  // Fetch all delivered parcels of the rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-earnings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/completedParcels"); // your backend endpoint
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  // Calculate earnings per parcel
  const calculateEarning = (parcel) => {
    if (parcel.senderRegion === parcel.receiverRegion) return parcel.price * 0.7;
    return parcel.price * 0.3;
  };

  // Filter parcels based on selected time frame
  const filteredParcels = parcels.filter((parcel) => {
    const deliveredAt = new Date(parcel.deliveredAt);
    switch (filter) {
      case "today":
        return isToday(deliveredAt);
      case "week":
        return isThisWeek(deliveredAt);
      case "month":
        return isThisMonth(deliveredAt);
      case "year":
        return isThisYear(deliveredAt);
      default:
        return true;
    }
  });

  const totalEarnings = parcels.reduce((sum, p) => sum + calculateEarning(p), 0);
  const totalCashedOut = parcels
    .filter((p) => p.isCashedOut)
    .reduce((sum, p) => sum + calculateEarning(p), 0);
  const totalPending = totalEarnings - totalCashedOut;

  const filteredEarnings = filteredParcels.reduce(
    (sum, p) => sum + calculateEarning(p),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaDollarSign /> My Earnings
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-green-100 text-green-800 shadow flex flex-col items-center">
          <span className="text-sm font-semibold">Total Earnings</span>
          <span className="text-2xl font-bold">৳{totalEarnings.toFixed(2)}</span>
        </div>
        <div className="p-4 rounded-lg bg-blue-100 text-blue-800 shadow flex flex-col items-center">
          <span className="text-sm font-semibold">Total Cashed Out</span>
          <span className="text-2xl font-bold">৳{totalCashedOut.toFixed(2)}</span>
        </div>
        <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 shadow flex flex-col items-center">
          <span className="text-sm font-semibold">Total Pending</span>
          <span className="text-2xl font-bold">৳{totalPending.toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["today", "week", "month", "year", "overall"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Filtered Earnings */}
      <div className="p-4 rounded-lg bg-gray-50 shadow">
        <h3 className="text-xl font-semibold mb-2">
          Earnings ({filter.charAt(0).toUpperCase() + filter.slice(1)}):
        </h3>
        <p className="text-2xl font-bold mb-4">৳{filteredEarnings.toFixed(2)}</p>

        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-semibold">Parcel</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Delivered At</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Earning</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel) => (
              <tr key={parcel._id} className="border-t hover:bg-gray-100 transition">
                <td className="px-4 py-2">{parcel.parcelName}</td>
                <td className="px-4 py-2 text-sm">
                  {parcel.deliveredAt ? format(new Date(parcel.deliveredAt), "PPpp") : "-"}
                </td>
                <td className="px-4 py-2 font-semibold">৳{calculateEarning(parcel).toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">
                  {parcel.isCashedOut ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Cashed Out
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filteredParcels.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 italic">
                  No earnings in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEarnings;
