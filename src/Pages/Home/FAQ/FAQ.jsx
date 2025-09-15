import React from "react";

const FAQ = () => {
  return (
    <div>
      <h1 className="text-4xl text-center font-extrabold">
        Frequently Asked Question (FAQ)
      </h1>
      <div className="text-center">
        <p className="mt-6">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce
        </p>
        <br />
        <p className="mb-10">pain, and strengthen your body with ease!</p>
      </div>
      {/* FAQ */}
      <div className="collapse collapse-arrow bg-base-100 mt-20 border border-base-300">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold">
          What is TrackMate Parcel Management System?
        </div>
        <div className="collapse-content text-sm">
          TrackMate is an intelligent parcel booking, tracking, and delivery
          management system that operates across all 64 districts of Bangladesh,
          ensuring fast, reliable, and secure deliveries
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          How does parcel tracking work?
        </div>
        <div className="collapse-content text-sm">
          Every parcel gets a unique tracking ID. Customers can enter this ID on
          the TrackMate platform to view real-time updates — from booking to
          final delivery.
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          How can I book a parcel for delivery?
        </div>
        <div className="collapse-content text-sm">
          You can book a parcel directly through our online platform or at any
          of our district branches. Simply provide sender/receiver details,
          parcel information, and select your preferred delivery option.
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border mb-20 border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          Do you cover all districts in Bangladesh?
        </div>
        <div className="collapse-content text-sm">
          Yes! TrackMate ensures full nationwide coverage with service branches
          in all 64 districts, making parcel delivery accessible everywhere.
        </div>
      </div>
    </div>
  );
};

export default FAQ;
