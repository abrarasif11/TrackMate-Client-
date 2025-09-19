import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, createUser } = useAuth();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => console.log("Google SignIn User:", res.user))
      .catch((err) => console.log("Google SignIn Error:", err));
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = "";

      // Upload image to ImgBB
      if (data.image && data.image[0]) {
        const file = data.image[0];
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_image_upload_key
          }`,
          { method: "POST", body: formData }
        );

        const imgData = await res.json();
        if (imgData.success) {
          imageUrl = imgData.data.url; // ImgBB URL
          console.log("Image uploaded to ImgBB:", imageUrl);
        } else {
          console.error("ImgBB Upload Failed:", imgData);
        }
      }

      // Create user in Firebase
      const userRes = await createUser(data.email, data.password);
      console.log("Firebase user created:", userRes.user);
  
     // update user info on DB 
     const userInfo = {
      email: data?.email,
      role : 'user', // default
      createdAt : new Date().toISOString(),
      last_log_in : new Date().toISOString()
     }
    


      // Update displayName and photoURL in Firebase
      await updateProfile(userRes.user, {
        displayName: data.name,
        photoURL: imageUrl || null,
      });

      console.log(
        "Updated Firebase profile:",
        userRes.user.displayName,
        userRes.user.photoURL
      );

      setUploading(false);

      // Show SweetAlert2
      Swal.fire({
        title: "Registration Successful!",
        html: `
          <p><strong>Name:</strong> ${userRes.user.displayName}</p>
          <p><strong>Email:</strong> ${userRes.user.email}</p>
          ${
            imageUrl
              ? `<p><strong>Image URL:</strong> <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
                 <img src="${imageUrl}" alt="Profile" class="w-20 h-20 rounded-full mt-2"/>`
              : ""
          }
        `,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/signIn");
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setUploading(false);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong during registration.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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

      {/* Preview Image */}
      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-full border"
          />
        </div>
      )}

      {/* Profile Image */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          id="image"
          onChange={(e) =>
            setPreview(
              e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null
            )
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
        />
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
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
            characters
          </p>
        )}
      </div>

      {/* Register Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-[#CAEB66] text-black font-medium rounded-md hover:bg-[#b8d95b] transition"
      >
        {uploading ? "Registering..." : "Register"}
      </button>

      {/* Already have account */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/signIn" className="text-[#A0C948] font-medium">
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
