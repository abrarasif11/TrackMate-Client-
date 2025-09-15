import React from "react";
import location from "../../../assets/assests/location-merchant.png";

const BeMerchant = () => {
  return (
    <div data-aos="zoom-in-up" className="bg-no-repeat bg-[#03373D] bg-[url('assets/assests/be-a-merchant-bg.png')]  rounded-4xl p-20 mb-20">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={location} className="max-w-sm rounded-lg" />
        <div>
          <h1 className="text-5xl text-white font-bold">
            Merchant and Customer Satisfaction <br />
            <span className="text-5xl text-white font-bold">
              {" "}
              is Our First Priority
            </span>
          </h1>
          <p className="py-6 text-white">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="bg-[#CAEB66] text-black rounded-full px-6 py-3 font-semibold">
            Become a Merchant
          </button>

          <button className="ml-5 border border-[#CAEB66] text-[#CAEB66] rounded-full px-6 py-3 font-semibold">
            Earn with TrackMate Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
