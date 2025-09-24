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

  // Calculate total parcels
  const total = stats.reduce((acc, item) => acc + item.count, 0);

  // Map status to icon
  const statusConfig = {
    "In Transit": { icon: <FaTruck className="text-blue-600 w-8 h-8" /> },
    "Rider Assigned": { icon: <FaMotorcycle className="text-orange-600 w-8 h-8" /> },
    Delivered: { icon: <FaCheckCircle className="text-green-600 w-8 h-8" /> },
    Processing: { icon: <FaBoxOpen className="text-purple-600 w-8 h-8" /> },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 Parcel Status Dashboard</h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, idx) => {
          const config = statusConfig[item.status] || {
            icon: <FaBoxOpen className="text-gray-600 w-8 h-8" />,
          };
          const percent = ((item.count / total) * 100).toFixed(1);
          return (
            <div
              key={idx}
              className="card shadow-lg rounded-xl p-4 flex items-center gap-4 bg-white"
            >
              <div className="flex-shrink-0">{config.icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{item.status}</h3>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-gray-500">{percent}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="card shadow-lg rounded-xl p-6 bg-white">
        <h3 className="text-lg font-bold mb-4 text-center">Delivery Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${((entry.count / total) * 100).toFixed(1)}%`}
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} parcels`, name]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
