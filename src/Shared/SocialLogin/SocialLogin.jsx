import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const axiosInstance = useAxios();

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      const user = res.user;
      console.log("Google SignIn User:", user);

      const userInfo = {
        _id: user.uid,
        email: user.email,
        name: user.displayName || "",
        image: user.photoURL || null,
        role: "user", // default
        createdAt: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Send to your MongoDB backend
      const response = await axiosInstance.post("/users", userInfo);
      console.log("User saved in DB:", response.data);
    } catch (err) {
      console.log("Google SignIn Error:", err);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default SocialLogin;
