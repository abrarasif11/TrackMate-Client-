import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { format } from "date-fns";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch payment history
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-[#CAEB66]">Payment History</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-[#CAEB66]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Parcel ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Transaction ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-[#CAEB66] hover:text-black transition">
                  <td className="px-6 py-4 text-sm">{payment.parcelId}</td>
                  <td className="px-6 py-4 text-sm">{payment.amount} ৳</td>
                  <td className="px-6 py-4 text-sm">{payment.paymentIntentId}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        payment.status.toLowerCase() === "succeeded"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {payment.createdAt ? format(new Date(payment.createdAt), "PPpp") : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {payment.paid_at ? format(new Date(payment.paid_at), "PPpp") : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
