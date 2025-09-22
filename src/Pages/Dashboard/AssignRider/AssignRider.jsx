import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch: refetchParcels,
  } = useQuery({
    queryKey: ["parcels-for-assign"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

  const {
    data: availableRiders = [],
    refetch: refetchRiders,
    isFetching: ridersLoading,
  } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderRegion],
    queryFn: async () => {
      if (!selectedParcel) return [];
      const res = await axiosSecure.get(
        `/riders/available?region=${selectedParcel.senderRegion}`
      );
      return res.data;
    },
    enabled: !!selectedParcel,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Failed to load parcels.</p>;

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRider(null);
    refetchRiders();
  };

  const handleConfirmAssign = async () => {
    if (!selectedRider) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Assign rider ${selectedRider.name} to parcel ${selectedParcel.trackingId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.post("/parcels/assign-rider", {
          parcelId: selectedParcel._id,
          riderId: selectedRider._id,
        });

        Swal.fire({
          icon: "success",
          title: "Rider Assigned!",
          text: `Rider ${selectedRider.name} has been assigned to parcel ${selectedParcel.trackingId}`,
          confirmButtonColor: "#CAEB66",
        });

        setSelectedParcel(null);
        setSelectedRider(null);
        refetchParcels();
      } catch (err) {
        console.error("Error assigning rider:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to assign rider. Please try again.",
          confirmButtonColor: "#CAEB66",
        });
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedParcel(null);
    setSelectedRider(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Assign Rider to Parcels
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white text-sm uppercase tracking-wider">
              <th className="px-6 py-4 text-left">Tracking ID</th>
              <th className="px-6 py-4 text-left">Parcel</th>
              <th className="px-6 py-4 text-left">Weight</th>
              <th className="px-6 py-4 text-left">Sender</th>
              <th className="px-6 py-4 text-left">Receiver</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Delivery</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, idx) => (
              <tr
                key={parcel._id}
                className={`transition duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-[#f2ffc6]`}
              >
                <td className="px-6 py-4 font-mono font-medium">
                  {parcel.trackingId}
                </td>
                <td className="px-6 py-4">{parcel.parcelName}</td>
                <td className="px-6 py-4">{parcel.parcelWeight} kg</td>
                <td className="px-6 py-4">
                  <p className="font-semibold">{parcel.senderName}</p>
                  <p className="text-xs text-gray-600">{parcel.senderRegion}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold">{parcel.receiverName}</p>
                  <p className="text-xs text-gray-600">
                    {parcel.receiverRegion}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {parcel.status}
                  </span>
                </td>
                {/* Delivery*/}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      parcel.deliveryStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : parcel.deliveryStatus === "In Transit"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">৳{parcel.price}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleAssignClick(parcel)}
                    className="bg-[#CAEB66] text-black px-3 py-1 rounded text-sm font-semibold hover:bg-[#b9df55] transition"
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Rider for Parcel</h3>
            <p className="mb-4 text-gray-600">
              Parcel: {selectedParcel.parcelName} ({selectedParcel.trackingId})
            </p>

            {ridersLoading ? (
              <Loader />
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableRiders.length > 0 ? (
                  availableRiders.map((rider) => (
                    <div
                      key={rider._id}
                      className="flex items-center justify-between border p-2 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedRider(rider)}
                    >
                      <div>
                        <p className="font-semibold">{rider.name}</p>
                        <p className="text-xs text-gray-500">
                          Region: {rider.region}
                        </p>
                      </div>
                      {selectedRider?._id === rider._id && (
                        <span className="text-green-600 font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No available riders in this region.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                disabled={!selectedRider}
                className={`px-4 py-2 rounded font-semibold transition ${
                  selectedRider
                    ? "bg-[#CAEB66] hover:bg-[#b9df55]"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
