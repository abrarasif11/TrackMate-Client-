import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from "date-fns";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const periods = ["Today", "Week", "Month", "Year", "Overall"];

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${email}`
      );
      return res.data || [];
    },
  });

  const calculateEarning = (parcel) => {
    const price = Number(parcel.price) || 0;
    return parcel.sender_center === parcel.receiver_center
      ? price * 0.8
      : price * 0.3;
  };

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    earningsByPeriod = { Today: 0, Week: 0, Month: 0, Year: 0, Overall: 0 };

  parcels.forEach((p) => {
    const earning = calculateEarning(p);
    const deliveredAt = p.delivered_at ? new Date(p.delivered_at) : null;
    total += earning;
    if (p.cashout_status === "cashed_out") totalCashedOut += earning;
    else totalPending += earning;

    if (deliveredAt) {
      if (isAfter(deliveredAt, todayStart))
        earningsByPeriod["Today"] += earning;
      if (isAfter(deliveredAt, weekStart)) earningsByPeriod["Week"] += earning;
      if (isAfter(deliveredAt, monthStart))
        earningsByPeriod["Month"] += earning;
      if (isAfter(deliveredAt, yearStart)) earningsByPeriod["Year"] += earning;
    }

    earningsByPeriod["Overall"] += earning;
  });

  const [activePeriod, setActivePeriod] = useState("Today");

  // Filter parcels for selected period
  const filteredParcels = parcels.filter((p) => {
    const deliveredAt = p.delivered_at ? new Date(p.delivered_at) : null;
    if (!deliveredAt) return false;

    switch (activePeriod) {
      case "Today":
        return isAfter(deliveredAt, todayStart);
      case "Week":
        return isAfter(deliveredAt, weekStart);
      case "Month":
        return isAfter(deliveredAt, monthStart);
      case "Year":
        return isAfter(deliveredAt, yearStart);
      default:
        return true;
    }
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Earnings</h2>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-100 p-4 rounded-xl shadow hover:scale-105 transition-transform">
              <p className="text-lg font-semibold">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{total.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl shadow hover:scale-105 transition-transform">
              <p className="text-lg font-semibold">Cashed Out</p>
              <p className="text-2xl font-bold text-blue-600">
                ৳{totalCashedOut.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl shadow hover:scale-105 transition-transform">
              <p className="text-lg font-semibold">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ৳{totalPending.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Period Tabs */}
          <div className="flex space-x-2 mt-6">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  activePeriod === period
                    ? "bg-gray-200 text-gray-800"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                } transition-colors`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Earnings Amount */}
          <div className="mt-4 bg-base-100 p-4 rounded-lg shadow">
            <p className="text-gray-500">Earnings ({activePeriod}):</p>
            <p className="text-2xl font-bold text-green-700">
              ৳{earningsByPeriod[activePeriod]?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* Earnings Table */}
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Parcel Name</th>
                  <th className="px-4 py-2 text-left">Delivered At</th>
                  <th className="px-4 py-2 text-left">Earning</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 italic text-gray-400"
                    >
                      No earnings in this period.
                    </td>
                  </tr>
                ) : (
                  filteredParcels.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="px-4 py-2">
                        {p.parcelName || "Unnamed Parcel"}
                      </td>
                      <td className="px-4 py-2">
                        {p.delivered_at
                          ? new Date(p.delivered_at).toLocaleString()
                          : "Not Delivered"}
                      </td>
                      <td className="px-4 py-2">
                        ৳{calculateEarning(p).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 capitalize">
                        {(p.cashout_status || "pending").replace("_", " ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEarnings;
