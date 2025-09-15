import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { createUser } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6"
    >
      {/* Title */}
      <div>
        <h1 className="text-5xl mb-2 font-bold text-gray-900">
          Create an Account
        </h1>
        <p className="text-gray-600">Register with TrackMate</p>
      </div>

      {/* name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="name"
          required
          {...register("name")}
          id="name"
          placeholder="Name"
          className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
        />
      </div>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          required
          {...register("email")}
          id="email"
          placeholder="Email"
          className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            required: true,
          })}
          id="password"
          placeholder="Password"
          className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
        />
        {errors.password?.type === "required" && (
          <p className="text-red-700 mt-2">Password is required</p>
        )}
        {errors.password?.type === "pattern" && (
          <p className="text-red-700 mt-2">
            Password must be uppercase, lowercase, number, special char, min 6
            character
          </p>
        )}
        <div className="mt-2">
          <a href="#" className="text-sm text-gray-500 hover:text-[#A0C948]">
            Forget Password?
          </a>
        </div>
      </div>

      {/* register Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#CAEB66] text-black font-medium rounded-md hover:bg-[#b8d95b] transition"
      >
        Register
      </button>

      {/* Register */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-[#A0C948] font-medium">
          Login
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">Or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex items-center justify-center gap-3 border rounded-md py-3 bg-gray-100 hover:bg-gray-200 transition"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-gray-700 font-medium">Login with Google</span>
      </button>
    </form>
  );
};

export default Register;
