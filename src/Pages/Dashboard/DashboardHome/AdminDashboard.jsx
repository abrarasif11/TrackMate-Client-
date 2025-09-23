import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import { FaTruck, FaMotorcycle, FaBoxOpen, FaCheckCircle } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4299e1", "#ed8936", "#48bb78", "#9f7aea"]; // Blue, Orange, Green, Purple

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch delivery status counts
  const { data: stats = [], isLoading, isError } = useQuery({
    queryKey: ["parcel-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-6">
        Failed to load parcel status data.
      </p>
    );

  // Map status to icon + colors for cards
  const statusConfig = {
    "In Transit": { icon: <FaTruck className="text-blue-600 w-8 h-8" /> },
    "Rider Assigned": { icon: <FaMotorcycle className="text-orange-600 w-8 h-8" /> },
    Delivered: { icon: <FaCheckCircle className="text-green-600 w-8 h-8" /> },
    Processing: { icon: <FaBoxOpen className="text-purple-600 w-8 h-8" /> },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 Parcel Status Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((item, idx) => {
            const config = statusConfig[item.status] || {
              icon: <FaBoxOpen className="text-gray-600 w-8 h-8" />,
            };
            return (
              <div
                key={idx}
                className="card shadow-lg rounded-xl p-4 flex items-center gap-4 bg-white"
              >
                <div className="flex-shrink-0">{config.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{item.status}</h3>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie Chart */}
        <div className="card shadow-lg rounded-xl p-4 bg-white flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-4">Delivery Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
