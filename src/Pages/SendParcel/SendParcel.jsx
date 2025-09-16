import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router";

const SendParcel = () => {
  const serviceCenter = useLoaderData() || [];

  // State
  const [parcelType, setParcelType] = useState("Document");
  const [confirmData, setConfirmData] = useState(null);
  const [priceBreak, setPriceBreak] = useState(null); // { base, extra, outsideSurcharge, total, breakdownLines }

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // watch fields used for dynamic selects & preview
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
//   const parcelWeightWatch = watch("parcelWeight");

  // unique regions (for region dropdowns)
  const uniqueRegions = [...new Set(serviceCenter.map((w) => w.region))];

  // districts / warehouses for a given region (unique)
  const getDistrictByRegion = (region) => {
    if (!region) return [];
    return [
      ...new Set(
        serviceCenter
          .filter((w) => w.region === region)
          .map((w) => w.district)
          .filter(Boolean)
      ),
    ];
  };

  // Price calculation helper returning an object containing breakdown for within and outside
  const computePricing = (type, weight) => {
    const w = Number(weight) || 0;
    // results for within and outside
    let within = { base: 0, extra: 0, outsideSurcharge: 0, total: 0, lines: [] };
    let outside = { ...within };

    if (type === "Document") {
      within.base = 60;
      outside.base = 80;
      within.total = within.base;
      outside.total = outside.base;
      within.lines = [`Base Charge: ৳${within.base}`];
      outside.lines = [`Base Charge: ৳${outside.base}`];
    } else {
      // Non-Document
      if (w <= 3) {
        within.base = 110;
        outside.base = 150;
        within.total = within.base;
        outside.total = outside.base;
        within.lines = [`Base (up to 3kg): ৳${within.base}`];
        outside.lines = [`Base (up to 3kg): ৳${outside.base}`];
      } else {
        // > 3kg
        const extraKg = w - 3;
        const extraAmount = extraKg * 40;
        within.base = 110;
        within.extra = extraAmount;
        within.total = within.base + within.extra;
        within.lines = [
          `Base (first 3kg): ৳${within.base}`,
          `Extra: ${extraKg}kg × ৳40 = ৳${within.extra}`,
        ];

        outside.base = 150;
        // outside also has extra per-kg plus an *additional* ৳40 surcharge (as in your table)
        outside.extra = extraAmount;
        outside.outsideSurcharge = 40;
        outside.total = outside.base + outside.extra + outside.outsideSurcharge;
        outside.lines = [
          `Base (first 3kg): ৳${outside.base}`,
          `Extra: ${extraKg}kg × ৳40 = ৳${outside.extra}`,
          `Outside zone surcharge: ৳${outside.outsideSurcharge}`,
        ];
      }
    }

    return { within, outside };
  };

  // handle proceed -> compute priceBreak and show confirmation
  const handleProceed = (data) => {
    // data contains registered fields
    // Determine pricing
    const pricing = computePricing(parcelType, data.parcelWeight);
    // Determine whether selected route is within city/district (same warehouse/district)
    const isWithin = data.senderWarehouse === data.receiverWarehouse;
    const selected = isWithin ? pricing.within : pricing.outside;

    setPriceBreak({
      pricing,
      selected,
      isWithin,
    });

    // Save form data to confirmData (include parcelType)
    setConfirmData({ ...data, parcelType });
  };

  // Final confirm -> you can add API call here
  const handleFinalConfirm = () => {
    // Example: send confirmData + priceBreak.selected.total to server
    toast.success("Parcel booked successfully!", {
      duration: 3000,
      position: "top-right",
    });

    // reset everything to initial
    reset();
    setParcelType("Document");
    setConfirmData(null);
    setPriceBreak(null);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
      <Toaster />

      <h2 className="text-3xl font-bold text-[#03464D] mb-2">Add Parcel</h2>
      <p className="text-gray-600 mb-6">Enter your parcel details</p>

      {!confirmData ? (
        // ========== FORM ========== //
        <form onSubmit={handleSubmit(handleProceed)}>
          {/* Parcel Type */}
          <div className="flex items-center space-x-6 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="Document"
                checked={parcelType === "Document"}
                onChange={(e) => setParcelType(e.target.value)}
                className="form-radio"
              />
              <span>Document</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="Non-Document"
                checked={parcelType === "Non-Document"}
                onChange={(e) => setParcelType(e.target.value)}
                className="form-radio"
              />
              <span>Non-Document</span>
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
                {...register("parcelWeight", { required: true, min: 0 })}
                type="number"
                step="0.1"
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

                {/* Region select */}
                <select
                  {...register("senderRegion", { required: true })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {/* Warehouse (district) depends on region */}
                <select
                  {...register("senderWarehouse", { required: true })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!senderRegion}
                >
                  <option value="">
                    {senderRegion ? "Select Warehouse / District" : "Select region first"}
                  </option>
                  {senderRegion &&
                    getDistrictByRegion(senderRegion).map((district) => (
                      <option value={district} key={district}>
                        {district}
                      </option>
                    ))}
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
                <textarea
                  {...register("pickupInstruction")}
                  placeholder="Pickup Instruction"
                  className="w-full border rounded-lg px-3 py-2"
                />
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

                {/* Region select */}
                <select
                  {...register("receiverRegion", { required: true })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {/* Warehouse (district) depends on region */}
                <select
                  {...register("receiverWarehouse", { required: true })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!receiverRegion}
                >
                  <option value="">
                    {receiverRegion ? "Select Warehouse / District" : "Select region first"}
                  </option>
                  {receiverRegion &&
                    getDistrictByRegion(receiverRegion).map((district) => (
                      <option value={district} key={district}>
                        {district}
                      </option>
                    ))}
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
                <textarea
                  {...register("deliveryInstruction")}
                  placeholder="Delivery Instruction"
                  className="w-full border rounded-lg px-3 py-2"
                />
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
      ) : (
        // ========== CONFIRMATION ========== //
        <div>
          <h3 className="text-xl font-bold mb-4 text-center">
            Confirm Your Parcel Booking
          </h3>

          {/* Static rate table for reference */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Parcel Type</th>
                  <th className="border px-4 py-2">Weight</th>
                  <th className="border px-4 py-2">Within City</th>
                  <th className="border px-4 py-2">Outside City/District</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Document</td>
                  <td className="border px-4 py-2">Any</td>
                  <td className="border px-4 py-2">৳60</td>
                  <td className="border px-4 py-2">৳80</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Non-Document</td>
                  <td className="border px-4 py-2">Up to 3kg</td>
                  <td className="border px-4 py-2">৳110</td>
                  <td className="border px-4 py-2">৳150</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Non-Document</td>
                  <td className="border px-4 py-2">&gt; 3kg</td>
                  <td className="border px-4 py-2">+ ৳40/kg</td>
                  <td className="border px-4 py-2">+ ৳40/kg + ৳40 extra</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary + Price Breakdown */}
          <div className="bg-gray-50 border rounded-lg p-6 mb-6">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Parcel Type</td>
                  <td>{confirmData.parcelType}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Parcel Weight</td>
                  <td>{confirmData.parcelWeight} kg</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Sender</td>
                  <td>
                    {confirmData.senderName} — {confirmData.senderWarehouse},{" "}
                    {confirmData.senderRegion}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Receiver</td>
                  <td>
                    {confirmData.receiverName} — {confirmData.receiverWarehouse},{" "}
                    {confirmData.receiverRegion}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Pickup Instruction</td>
                  <td>{confirmData.pickupInstruction || "N/A"}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Delivery Instruction</td>
                  <td>{confirmData.deliveryInstruction || "N/A"}</td>
                </tr>

                <tr className="border-t">
                  <td className="py-2 font-bold">Price Breakdown</td>
                  <td>
                    {/* breakdown lines */}
                    {priceBreak &&
                      priceBreak.selected.lines.map((line, idx) => (
                        <div key={idx} className="text-sm">
                          {line}
                        </div>
                      ))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold">Total Cost</td>
                  <td className="text-lg font-bold text-[#03464D]">
                    ৳{priceBreak ? priceBreak.selected.total : "0"}
                    <span className="text-sm text-gray-500 ml-2">
                      ({priceBreak && priceBreak.isWithin ? "Within City" : "Outside City/District"})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleFinalConfirm}
              className="bg-[#CAEB66] text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-lime-500 transition"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => {
                // go back to edit (keep current form values)
                setConfirmData(null);
                setPriceBreak(null);
              }}
              className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendParcel;
