import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch parcels
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcels-for-assign"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Failed to load parcels.</p>;

  return (
    <div className="max-w-7xl mx-auto bg-white text-black rounded-2xl shadow-xl p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Assign Rider to Parcels
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse min-w-[700px] md:min-w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#CAEB66] text-black text-xs md:text-sm uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Tracking ID</th>
              <th className="px-4 py-3 text-left">Parcel</th>
              <th className="px-4 py-3 text-left">Weight</th>
              <th className="px-4 py-3 text-left">Sender</th>
              <th className="px-4 py-3 text-left">Receiver</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Delivery</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {parcels.map((parcel, idx) => (
              <tr
                key={parcel._id}
                className={`transition duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-[#f8ffd6]`}
              >
                <td className="px-4 py-2 font-mono font-medium text-sm md:text-base">
                  {parcel.trackingId}
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  {parcel.parcelName}
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  {parcel.parcelWeight} kg
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  <p className="font-semibold">{parcel.senderName}</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {parcel.senderRegion}
                  </p>
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  <p className="font-semibold">{parcel.receiverName}</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {parcel.receiverRegion}
                  </p>
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  <span className="px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                    {parcel.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm md:text-base">
                  <span className="px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-green-100 text-green-700">
                    {parcel.deliveryStatus}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm md:text-base font-bold">
                  ৳{parcel.price}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => console.log("Assign Rider clicked:", parcel)}
                    className="bg-[#CAEB66] text-black font-semibold px-3 py-1 md:px-4 md:py-2 rounded-md shadow hover:bg-[#b5d950] text-sm md:text-base transition"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {parcels.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-10 text-gray-600 bg-white text-sm md:text-base"
                >
                  🚚 No parcels available for assignment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignRider;
