import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { format } from "date-fns";
import { Eye, CreditCard, Trash2 } from "lucide-react";
import Swal from "sweetalert2"; // SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // ✅ Fetch parcels only when user.email exists
  const { data: parcels = [], refetch, isLoading } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (parcel) => setSelectedParcel(parcel);

  const handlePay = async (id) => {
    navigate(`/dashboard/payment/${id}`);
    console.log("Pay Parcel ID:", id);
  };

  const handleDelete = async (parcel) => {
    // SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete parcel "${parcel.parcelName || "Unnamed"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#000",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/parcels/${parcel._id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: `"${parcel.parcelName || "Parcel"}" has been deleted.`,
          icon: "success",
          confirmButtonColor: "#CAEB66",
          background: "#000",
          color: "#fff",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the parcel.",
          icon: "error",
          confirmButtonColor: "#CAEB66",
          background: "#000",
          color: "#fff",
        });
      }
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-black">
      <h2 className="text-3xl font-bold mb-6 text-[#CAEB66]">My Parcels</h2>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10 text-white">
          Loading parcels...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#CAEB66]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Parcel Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Created At
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {parcels.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No parcels found
                  </td>
                </tr>
              ) : (
                parcels.map((parcel) => (
                  <tr
                    key={parcel._id}
                    className="border-b hover:bg-[#CAEB66] transition"
                  >
                    <td className="px-6 py-4 text-sm">
                      {parcel.parcelName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {parcel.parcelType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {parcel.price || 0} ৳
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          (parcel.status || "Unpaid").toLowerCase() === "paid"
                            ? "bg-[#CAEB66] text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        {parcel.status || "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {parcel.createdAt
                        ? format(new Date(parcel.createdAt), "PPpp")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleView(parcel)}
                        className="text-black hover:text-white"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {(parcel.status || "Unpaid").toLowerCase() !==
                        "paid" && (
                        <button
                          onClick={() => handlePay(parcel._id)}
                          className="text-[#CAEB66] hover:text-black"
                        >
                          <CreditCard className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(parcel)}
                        className="text-black hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-[#CAEB66]">
              Parcel Details
            </h3>
            <p>
              <strong>Name:</strong>{" "}
              {selectedParcel.parcelName || "N/A"}
            </p>
            <p>
              <strong>Weight:</strong>{" "}
              {selectedParcel.parcelWeight || "N/A"} KG
            </p>
            <p>
              <strong>Sender:</strong>{" "}
              {selectedParcel.senderName || "N/A"} (
              {selectedParcel.senderRegion || "N/A"})
            </p>
            <p>
              <strong>Receiver:</strong>{" "}
              {selectedParcel.receiverName || "N/A"} (
              {selectedParcel.receiverRegion || "N/A"})
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full font-semibold ${
                  (selectedParcel.status || "Unpaid").toLowerCase() ===
                  "paid"
                    ? "bg-[#CAEB66] text-black"
                    : "bg-black text-white"
                }`}
              >
                {selectedParcel.status || "Unpaid"}
              </span>
            </p>
            <p>
              <strong>Price:</strong> {selectedParcel.price || 0} ৳
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-[#CAEB66] text-black rounded-lg hover:bg-black hover:text-[#CAEB66] transition"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
