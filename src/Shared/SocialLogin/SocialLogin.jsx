import React from "react";
import useAuth from "../../hooks/useAuth";

const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => console.log("Google SignIn User:", res.user))
      .catch((err) => console.log("Google SignIn Error:", err));
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
