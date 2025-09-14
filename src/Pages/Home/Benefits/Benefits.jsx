import React from "react";
import parcel from "../../../assets/banner/live-tracking.png";
import safe from "../../../assets/banner/safe-delivery.png";
import call from "../../../assets/banner/tiny-deliveryman.png";

// Your JSON data
const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: parcel,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safe,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: call,
  },
];

const Benefits = () => {
  return (
    <section className="py-12 px-6 mt-10 bg-gray-50 mb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white rounded-xl shadow-sm"
          >
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src={benefit.image} alt="" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
