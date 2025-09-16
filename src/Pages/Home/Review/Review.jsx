import React from "react";
import reviewImg from "../../../assets/assests/customer-top.png";
import TestimonialCarousel from "./TestimonialCarousel";

const Review = () => {
  return (
    <section className=" py-12">
      <div className="max-w-3xl  mx-auto text-center px-4">
        {/* Replace with your own SVG/Image */}
        <div className="flex justify-center mb-6">
          <img
            src={reviewImg}
            alt="Boxes illustration"
            className="w-[244.12px] h-[100px]"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
          What our customers are saying
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      
      <TestimonialCarousel />
    </section>
  );
};

export default Review;
