import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext/AuthContext";
const ForgetPassword = () => {
  const { auth } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      await auth.sendPasswordResetEmail(data.email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium text-black transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#CAEB66] "
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        {successMessage && (
          <p className="text-green-600 mt-4">{successMessage}</p>
        )}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

        <p className="mt-6 text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/signIn" className="text-[#CAEB66] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
