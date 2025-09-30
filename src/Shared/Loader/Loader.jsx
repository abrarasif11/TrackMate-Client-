import React from "react";
import { Truck } from "lucide-react";

const Loader = ({ message = "Delivering your parcels..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* Animated Truck Path */}
      <div className="relative w-32 h-20 overflow-hidden">
        {/* Road line */}
        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-[#CAEB66] via-emerald-400 to-[#CAEB66] animate-pulse"></div>

        {/* Truck animation */}
        <Truck className="absolute bottom-2 left-0 w-10 h-10 text-[#CAEB66] animate-truck" />
      </div>

      {/* Message with bouncing dots */}
      <div className="flex items-center gap-1 text-lg font-semibold text-gray-700">
        <span>{message}</span>
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-150">.</span>
        <span className="animate-bounce delay-300">.</span>
      </div>

      <style>{`
        @keyframes truckMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(80px); }
          100% { transform: translateX(0); }
        }
        .animate-truck {
          animation: truckMove 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
