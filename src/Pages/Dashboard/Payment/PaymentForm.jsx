import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
 const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message)
    } else {
      console.log("Payment Method", paymentMethod);
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
        Pay For Parcel Pickup
      </button>
      {
        error && <p className="text-red-600 mt-4">{error}</p>
      }
    </form>
  );
};

export default PaymentForm;
