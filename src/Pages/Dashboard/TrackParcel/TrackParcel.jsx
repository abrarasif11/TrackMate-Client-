import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const TrackParcelPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState(null);

  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
  } = useQuery({
    queryKey: ["userParcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const {
    data: updates = [],
    refetch: refetchUpdates,
    isLoading: updatesLoading,
    isError: updatesError,
  } = useQuery({
    queryKey: ["tracking", selectedParcel?.trackingId],
    queryFn: async () => {
      if (!selectedParcel?.trackingId) return [];
      const res = await axiosSecure.get(
        `/trackings/${selectedParcel.trackingId}`
      );
      return res.data;
    },
    enabled: !!selectedParcel?.trackingId,
  });

  const handleParcelSelect = (parcel) => {
    setSelectedParcel(parcel);
    refetchUpdates();
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Parcels</h1>
      <p className="text-gray-500 mb-6">
        View your parcels and track their status
      </p>

      {/* Parcels List */}
      <div className="mb-8">
        {parcelsLoading && <p>Loading your parcels...</p>}
        {parcelsError && <p className="text-red-500">Error loading parcels.</p>}
        {!parcelsLoading && parcels.length === 0 && (
          <p className="text-gray-500">You have no parcels.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel._id}
              className={`p-4 rounded-xl shadow-md cursor-pointer ${
                selectedParcel?._id === parcel._id
                  ? "bg-green-100 border-2 border-green-400"
                  : "bg-white"
              }`}
              onClick={() => handleParcelSelect(parcel)}
            >
              <p className="font-semibold text-gray-800">
                {parcel.parcelName} ({parcel.trackingId})
              </p>
              <p className="text-gray-500">
                Status:{" "}
                <span
                  className={
                    parcel.deliveryStatus === "Delivered"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }
                >
                  {parcel.deliveryStatus}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Parcel Details */}
      {selectedParcel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Parcel Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Parcel Details
            </h2>

            <p className="text-gray-500 mb-1">
              <strong>Parcel Name:</strong> {selectedParcel.parcelName}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Weight:</strong> {selectedParcel.parcelWeight} KG
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Type:</strong> {selectedParcel.parcelType}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Price:</strong> ${selectedParcel.price}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Tracking Code:</strong> {selectedParcel.trackingId}
            </p>
            <p className="text-gray-500 mb-1">
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedParcel.deliveryStatus === "Delivered"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {selectedParcel.deliveryStatus}
              </span>
            </p>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Sender Info</h3>
              <p className="text-gray-500 mb-1">
                <strong>Name:</strong> {selectedParcel.senderName}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Email:</strong> {selectedParcel.senderEmail}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Region:</strong> {selectedParcel.senderRegion}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Warehouse:</strong> {selectedParcel.senderWarehouse}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Address:</strong> {selectedParcel.senderAddress}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Contact:</strong> {selectedParcel.senderContact}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Pickup Instruction:</strong>{" "}
                {selectedParcel.pickupInstruction}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Receiver Info
              </h3>
              <p className="text-gray-500 mb-1">
                <strong>Name:</strong> {selectedParcel.receiverName}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Region:</strong> {selectedParcel.receiverRegion}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Warehouse:</strong> {selectedParcel.receiverWarehouse}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Address:</strong> {selectedParcel.receiverAddress}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Contact:</strong> {selectedParcel.receiverContact}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Delivery Instruction:</strong>{" "}
                {selectedParcel.deliveryInstruction}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Assigned Rider
              </h3>
              <p className="text-gray-500 mb-1">
                <strong>Name:</strong> {selectedParcel.assignedRiderName}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Email:</strong> {selectedParcel.assignedRiderEmail}
              </p>
            </div>
          </div>

          {/* Tracking Updates */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tracking Updates
            </h2>

            {updatesLoading && <p>Loading updates...</p>}
            {updatesError && (
              <p className="text-red-500">Error fetching updates.</p>
            )}
            {!updatesLoading && updates.length === 0 && (
              <p className="text-gray-500">No updates found for this parcel.</p>
            )}

            <div className="relative border-l border-gray-300 pl-6 space-y-6">
              {updates.map((update) => (
                <div key={update._id} className="relative">
                  <span className="absolute -left-3 top-1  bg-green-200 text-green-600 w-5 h-5  flex items-center justify-center rounded-full">
                    ✓
                  </span>
                  <p className="text-gray-500 ml-5 text-sm">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-800 ml-5">{update.status}</p>
                  {update.details && (
                    <p className="text-gray-500 text-sm ml-5">
                      {update.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcelPage;
