import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const TrackParcel = () => {
  const { user } = useAuth(); // get logged-in user
  const email = user?.email;
  const axiosSecure = useAxiosSecure();

  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      if (!email) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.get(`/trackings/user/${email}`);
        if (!Array.isArray(res.data)) {
          setTrackingData([]);
          setError("Invalid data from backend");
          return;
        }

        // Normalize MongoDB timestamp
        const formattedData = res.data
          .map((item) => ({
            ...item,
            timestamp: item.timestamp?.$date?.$numberLong
              ? Number(item.timestamp.$date.$numberLong)
              : new Date(item.timestamp).getTime(),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setTrackingData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tracking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [email, axiosSecure]);

  if (loading) return <p>Loading tracking data...</p>;
  if (error) return <p>{error}</p>;
  if (trackingData.length === 0) return <p>No tracking updates found.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Your Tracking History</h2>
      <ul className="space-y-4">
        {trackingData.map((item, index) => (
          <li
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
          >
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            <p>
              <strong>Details:</strong> {item.details}
            </p>
            {item.deliveryInstruction && (
              <p>
                <strong>Delivery Instruction:</strong>{" "}
                {item.deliveryInstruction}
              </p>
            )}
            <p>
              <strong>Updated By:</strong> {item.updated_by}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackParcel;
