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
  const navigate = useNavigate()
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Fetch parcels
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`, {
        // headers: {
        //   Authorization: `Bearer ${user.accessToken}`
        // }
      });
      return res.data;
    },
  });

  
  const handleView = (parcel) => setSelectedParcel(parcel);

  const handlePay = async (id) => {
    navigate(`/dashboard/payment/${id}`);
    console.log("Pay Parcel ID:", id);
    // Swal.fire({
    //   title: "Redirecting to Payment",
    //   text: `Proceed to pay for Parcel ID: ${id}`,
    //   icon: "info",
    //   confirmButtonColor: "#CAEB66",
    //   background: "#000",
    //   color: "#fff",
    // });
    // 👉 here you can redirect to payment page or API call
    // e.g., navigate(`/payment/${id}`);


  };

  const handleDelete = async (parcel) => {
    // SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete parcel "${parcel.parcelName}"?`,
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
          text: `"${parcel.parcelName}" has been deleted.`,
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

      {/* Table */}
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
            {parcels.map((parcel) => (
              <tr
                key={parcel._id}
                className="border-b hover:bg-[#CAEB66] transition"
              >
                <td className="px-6 py-4 text-sm">{parcel.parcelName}</td>
                <td className="px-6 py-4 text-sm">{parcel.parcelType}</td>
                <td className="px-6 py-4 text-sm">{parcel.price} ৳</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      parcel.status.toLowerCase() === "paid"
                        ? "bg-[#CAEB66] text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {format(new Date(parcel.createdAt), "PPpp")}
                </td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleView(parcel)}
                    className="text-black hover:text-white"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {parcel.status.toLowerCase() !== "paid" && (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-[#CAEB66]">
              Parcel Details
            </h3>
            <p>
              <strong>Name:</strong> {selectedParcel.parcelName}
            </p>
            <p>
              <strong>Weight:</strong> {selectedParcel.parcelWeight} KG
            </p>
            <p>
              <strong>Sender:</strong> {selectedParcel.senderName} (
              {selectedParcel.senderRegion})
            </p>
            <p>
              <strong>Receiver:</strong> {selectedParcel.receiverName} (
              {selectedParcel.receiverRegion})
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full font-semibold ${
                  selectedParcel.status.toLowerCase() === "paid"
                    ? "bg-[#CAEB66] text-black"
                    : "bg-black text-white"
                }`}
              >
                {selectedParcel.status}
              </span>
            </p>
            <p>
              <strong>Price:</strong> {selectedParcel.price} ৳
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
