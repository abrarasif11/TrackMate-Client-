import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  // onSubmit function
  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((res) => {
        console.log(res.user);
        navigate(from);
      })
      .catch((err) => console.log(err));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res.user);
        navigate(from);
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
        <h1 className="text-5xl mb-2 font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600">Login with TrackMate</p>
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
            Password must include uppercase, lowercase, number, special
            character, and be at least 6 characters long
          </p>
        )}
        <div className="mt-2">
          <a href="#" className="text-sm text-gray-500 hover:text-[#A0C948]">
            Forget Password?
          </a>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#CAEB66] text-black font-medium rounded-md hover:bg-[#b8d95b] transition"
      >
        Login
      </button>

      {/* Register */}
      <p className="text-sm text-center text-gray-600">
        Don’t have any account?{" "}
        <Link to="/register" className="text-[#A0C948] font-medium">
          Register
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

export default Login;
