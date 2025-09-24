import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const price = Number(parcel.price);
    return parcel.sender_center === parcel.receiver_center
      ? price * 0.8
      : price * 0.3;
  };

  // Mutation for cashout
  const { mutateAsync: cashout } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
  });

  const handleCashout = (parcelId) => {
    Swal.fire({
      title: "Confirm Cashout",
      text: "You are about to cash out this delivery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        cashout(parcelId)
          .then(() => {
            Swal.fire("Success", "Cashout completed.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to cash out. Try again.", "error");
          });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Fee (৳)</th>
                <th className="px-4 py-3">Your Earning (৳)</th>
                <th className="px-4 py-3">Picked At</th>
                <th className="px-4 py-3">Delivered At</th>
                <th className="px-4 py-3">Cashout</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr
                  key={parcel._id}
                  className={`border-t transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {parcel.trackingId}
                  </td>
                  <td className="px-4 py-3">{parcel.parcelName}</td>
                  <td className="px-4 py-3">
                    <div>{parcel.senderName}</div>
                    <div className="text-xs text-gray-500">
                      {parcel.senderRegion}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{parcel.receiverName}</div>
                    <div className="text-xs text-gray-500">
                      {parcel.receiverRegion}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {parcel.price}৳
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    {calculateEarning(parcel)}৳
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {parcel.picked_at
                      ? new Date(parcel.picked_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {parcel.delivered_at
                      ? new Date(parcel.delivered_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {parcel.cashout_status === "cashed_out" ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Cashed Out
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCashout(parcel._id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                      >
                        Cashout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
