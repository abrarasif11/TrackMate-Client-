import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const PaymentForm = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");

  // Fetch parcel data
  const { isLoading, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`parcels/${id}`);
      // Access the nested `data` field from your API response
      return res.data.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  console.log("Parcel Data:", parcelInfo);

  // Safely get the amount (default to 0 if undefined)
  const amount = parcelInfo?.price || 0;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      console.log("Payment Method", paymentMethod);
      setError("");
      //  server to create a payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        id,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Jerin",
          },
        },
      });

      if (result.error) {
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment Successful");
          console.log(result)
        }
      }
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
    </form>
  );
};

export default PaymentForm;
