// App.jsx or PaymentWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Key);

const PaymentWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentWrapper;
