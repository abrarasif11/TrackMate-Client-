import { motion } from "framer-motion";
import error from "../../assets/assests/18499954_bubble_gum200_89 1.png";

const MotionImage = motion.img;

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center rounded-3xl mb-20 mt-20 justify-center pt-20 pb-20 bg-gray-50 px-4">
      {/* Animated Image */}
      <MotionImage
        src={error}
        alt="Error 404"
        className="w-[300px]"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-6 py-2 bg-[#CAEB66] font-semibold hover:bg-lime-500 text-black font-medium rounded-lg shadow"
      >
        Go Home
      </button>
    </div>
  );
};

export default ForbiddenPage;
