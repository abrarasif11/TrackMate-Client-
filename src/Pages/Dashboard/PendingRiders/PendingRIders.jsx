import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);

  const fetchPendingRiders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/riders/pending");
      setRiders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRiders();
  }, []);

  const handleStatusUpdate = async (riderId, status) => {
    const actionText = status === "Active" ? "Approve" : "Reject";
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${riderId}`, { status });
        Swal.fire(
          "Success!",
          `Rider ${actionText.toLowerCase()}ed successfully.`,
          "success"
        );
        fetchPendingRiders();
        setSelectedRider(null);
      } catch (err) {
        Swal.fire("Error!", err.response?.data?.message || err.message, "error");
      }
    }
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-black">Pending Riders</h2>

      {loading ? (
        <p className="text-black">Loading...</p>
      ) : riders.length === 0 ? (
        <p className="text-black">No pending riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-black">Name</th>
                <th className="px-4 py-2 border text-black">Email</th>
                <th className="px-4 py-2 border text-black">Phone</th>
                <th className="px-4 py-2 border text-black">Joined At</th>
                <th className="px-4 py-2 border text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id}>
                  <td className="px-4 py-2 border text-black">{rider.name}</td>
                  <td className="px-4 py-2 border text-black">{rider.email}</td>
                  <td className="px-4 py-2 border text-black">{rider.phone || "-"}</td>
                  <td className="px-4 py-2 border text-black">
                    {new Date(rider.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border space-x-2 flex items-center">
                    <button
                      className="bg-[#CAEB66] text-black px-3 py-1 rounded flex items-center justify-center hover:opacity-90"
                      onClick={() => setSelectedRider(rider)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="bg-[#CAEB66] text-black px-3 py-1 rounded flex items-center justify-center hover:opacity-90"
                      onClick={() => handleStatusUpdate(rider._id, "Active")}
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="bg-[#CAEB66] text-black px-3 py-1 rounded flex items-center justify-center hover:opacity-90"
                      onClick={() => handleStatusUpdate(rider._id, "Rejected")}
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for rider details */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setSelectedRider(null)}
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-2 text-black">Rider Details</h3>
            <p className="text-black">
              <strong>Name:</strong> {selectedRider.name}
            </p>
            <p className="text-black">
              <strong>Email:</strong> {selectedRider.email}
            </p>
            <p className="text-black">
              <strong>Phone:</strong> {selectedRider.phone || "-"}
            </p>
            <p className="text-black">
              <strong>Status:</strong> {selectedRider.status}
            </p>
            <p className="text-black">
              <strong>Joined At:</strong>{" "}
              {new Date(selectedRider.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-[#CAEB66] text-black px-4 py-2 rounded flex items-center gap-2 hover:opacity-90"
                onClick={() => handleStatusUpdate(selectedRider._id, "Active")}
              >
                <FaCheck /> Approve
              </button>
              <button
                className="bg-[#CAEB66] text-black px-4 py-2 rounded flex items-center gap-2 hover:opacity-90"
                onClick={() => handleStatusUpdate(selectedRider._id, "Rejected")}
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
