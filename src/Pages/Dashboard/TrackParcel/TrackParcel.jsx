import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const TrackingPage = () => {
  const { trackingId: trackingIdFromUrl } = useParams();
  const [trackingId, setTrackingId] = useState(trackingIdFromUrl || "");
  const axiosSecure = useAxiosSecure();

  // Fetch tracking updates using React Query v5 object syntax
  const {
    data: updates = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: async () => {
      if (!trackingId) return [];
      const res = await axiosSecure.get(`/trackings/${trackingId}`);
      return res.data;
    },
    enabled: !!trackingId, // only fetch if trackingId exists
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const id = e.target.trackingId.value.trim();
    if (id) {
      setTrackingId(id);
      refetch(); // refetch data for new trackingId
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#FA2A3B]">Track Parcel</h1>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          name="trackingId"
          placeholder="Enter Tracking ID"
          className="border p-2 rounded flex-1"
          defaultValue={trackingIdFromUrl || ""}
        />
        <button
          type="submit"
          className="bg-[#FA2A3B] text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Loading / Error */}
      {isLoading && <p>Loading...</p>}
      {isError && (
        <p className="text-red-500">
          Error fetching tracking updates. Make sure the ID is correct.
        </p>
      )}

      {/* Tracking Updates */}
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update._id}
            className="p-4 border rounded shadow-sm bg-white"
          >
            <p>
              <strong>Status:</strong> {update.status}
            </p>
            <p>
              <strong>Details:</strong> {update.details}
            </p>
            {update.deliveryInstruction && (
              <p>
                <strong>Delivery Instruction:</strong>{" "}
                {update.deliveryInstruction}
              </p>
            )}
            <p>
              <strong>Updated By:</strong> {update.updated_by}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(update.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

        {updates.length === 0 && !isLoading && trackingId && (
          <p className="text-gray-500">
            No updates found for this tracking ID.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
