import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const SendParcel = () => {
  const [parcelType, setParcelType] = useState("Document");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = (data) => {
    data.parcelType = parcelType;
    console.log("Form Data:", data);

    toast.success("Parcel booked successfully!", {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
      {/* Toast container */}
      <Toaster />

      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#03464D] mb-2">Add Parcel</h2>
      <p className="text-gray-600 mb-6">Enter your parcel details</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Parcel Type */}
        <div className="flex items-center space-x-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="Document"
              checked={parcelType === "Document"}
              onChange={(e) => setParcelType(e.target.value)}
              className="form-radio text-green-600"
            />
            <span>Document</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="Not-Document"
              checked={parcelType === "Not-Document"}
              onChange={(e) => setParcelType(e.target.value)}
              className="form-radio text-green-600"
            />
            <span>Not-Document</span>
          </label>
        </div>

        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Name
            </label>
            <input
              {...register("parcelName", { required: true })}
              type="text"
              placeholder="Parcel Name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.parcelName && (
              <span className="text-red-500 text-sm">
                Parcel name is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Weight (KG)
            </label>
            <input
              {...register("parcelWeight", { required: true })}
              type="number"
              placeholder="Parcel Weight (KG)"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            {errors.parcelWeight && (
              <span className="text-red-500 text-sm">Weight is required</span>
            )}
          </div>
        </div>

        {/* Sender & Receiver Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sender Details
            </h3>

            <div className="space-y-4">
              <input
                {...register("senderName", { required: true })}
                type="text"
                placeholder="Sender Name"
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                {...register("senderWarehouse", { required: true })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Wire house</option>
                <option>Warehouse A</option>
                <option>Warehouse B</option>
              </select>
              <input
                {...register("senderAddress", { required: true })}
                type="text"
                placeholder="Address"
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                {...register("senderContact", { required: true })}
                type="text"
                placeholder="Sender Contact No"
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                {...register("senderRegion", { required: true })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select your region</option>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
              </select>
              <textarea
                {...register("pickupInstruction")}
                placeholder="Pickup Instruction"
                className="w-full border rounded-lg px-3 py-2"
              ></textarea>
            </div>
          </div>

          {/* Receiver Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Receiver Details
            </h3>

            <div className="space-y-4">
              <input
                {...register("receiverName", { required: true })}
                type="text"
                placeholder="Receiver Name"
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                {...register("receiverWarehouse", { required: true })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Wire house</option>
                <option>Warehouse A</option>
                <option>Warehouse B</option>
              </select>
              <input
                {...register("receiverAddress", { required: true })}
                type="text"
                placeholder="Receiver Address"
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                {...register("receiverContact", { required: true })}
                type="text"
                placeholder="Receiver Contact No"
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                {...register("receiverRegion", { required: true })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select your region</option>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
              </select>
              <textarea
                {...register("deliveryInstruction")}
                placeholder="Delivery Instruction"
                className="w-full border rounded-lg px-3 py-2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Pickup Info */}
        <p className="text-sm text-gray-500 mt-6">
          * PickUp Time 4pm-7pm Approx.
        </p>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-[#CAEB66] text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-lime-500 transition"
          >
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
