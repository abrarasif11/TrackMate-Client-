import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch parcel safely
  const {
    isPending,
    isError,
    error: queryError,
    data: parcelInfo,
  } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/parcels/${id}`);
        return res.data || null;
      } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
  });

  if (isPending) return <Loader />;
  if (isError)
    return <p className="text-red-500">Error: {queryError.message}</p>;
  if (!parcelInfo) return <p className="text-red-500">Parcel not found.</p>;

  console.log("Parcel Data:", parcelInfo);

  // Safely get price
  const amount = parcelInfo?.price ?? 0;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    //  Create Stripe Payment Method
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    setError("");
    setSuccess("");
    console.log("Payment Method:", paymentMethod);

    try {
      // Create Payment Intent from backend
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        id, // send parcel ID so backend can use if needed
      });

      const clientSecret = res.data.clientSecret;

      //  Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName || "Anonymous",
            email: user.email,
          },
        },
      });

      if (result.error) {
        console.log("Payment error:", result.error.message);
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log(" Payment Successful");
        console.log(result);

        // Save payment to backend (update parcel + history)
        const paymentData = {
          parcelId: id,
          paymentIntentId: result.paymentIntent.id,
          amount,
          createdBy: user.email,
        };

        const confirmRes = await axiosSecure.post(
          "/confirm-payment",
          paymentData
        );

        if (confirmRes.data?._id) {
          setSuccess("🎉 Payment successful and saved!");
          console.log("💰 Payment saved:", confirmRes.data);
        }
      }
    } catch (err) {
      console.error("Payment failed:", err.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-[#CAEB66] px-4 py-2 rounded hover:bg-green-400"
      >
        Pay ৳{amount}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </form>
  );
};

export default PaymentForm;
