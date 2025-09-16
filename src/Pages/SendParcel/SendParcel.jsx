import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const serviceCenter = useLoaderData() || [];
  const { user } = useAuth();

  // State
  const [parcelType, setParcelType] = useState("Document");
  const [confirmData, setConfirmData] = useState(null);
  const [priceBreak, setPriceBreak] = useState(null);

  // react-hook-form (including setValue so we can prefill senderEmail)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill senderEmail with logged-in user email (if exists)
  useEffect(() => {
    if (user?.email) setValue("senderEmail", user.email);
  }, [user, setValue]);

  // watched values for dependent selects / preview
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const uniqueRegions = [...new Set(serviceCenter.map((w) => w.region))];

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

  // Generate a reasonably-unique tracking ID
  const generateTrackingId = () =>
    `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

  // Pricing logic (returns { within, outside })
  const computePricing = (type, weight) => {
    const w = Number(weight) || 0;
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
      if (w <= 3) {
        within.base = 110;
        outside.base = 150;
        within.total = within.base;
        outside.total = outside.base;
        within.lines = [`Base (up to 3kg): ৳${within.base}`];
        outside.lines = [`Base (up to 3kg): ৳${outside.base}`];
      } else {
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

  // Proceed -> prepare confirmation data + priceBreak
  const handleProceed = (data) => {
    const pricing = computePricing(parcelType, data.parcelWeight);
    const isWithin = data.senderWarehouse === data.receiverWarehouse;
    const selected = isWithin ? pricing.within : pricing.outside;

    // Add metadata needed for tracking & audit
    const parcelData = {
      ...data,
      parcelType,
      createdBy: user?.email || "unknown",
      createdAt: new Date().toISOString(),
      trackingId: generateTrackingId(),
      status: "Pending",
    };

    setPriceBreak({ pricing, selected, isWithin });
    setConfirmData(parcelData);
  };

  // Final confirm: here you would POST to your backend
  const handleFinalConfirm = async () => {
    const payload = {
      ...confirmData,
      price: priceBreak?.selected?.total ?? 0,
    };

    // Example: send payload to server
    // await fetch("/api/parcels", { method: "POST", body: JSON.stringify(payload) })

    console.log("Saving parcel:", payload);

    toast.success("Parcel booked successfully!", {
      duration: 3000,
      position: "top-right",
    });

    // reset form & state
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
        // ====== FORM ======
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
              <label className="block text-sm font-medium mb-1">
                Parcel Name
              </label>
              <input
                {...register("parcelName", { required: "Parcel name is required" })}
                type="text"
                placeholder="Parcel Name"
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.parcelName && (
                <span className="text-red-500 text-sm">{errors.parcelName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Parcel Weight (KG)
              </label>
              <input
                {...register("parcelWeight", {
                  required: "Parcel weight is required",
                  min: { value: 0, message: "Weight must be >= 0" },
                })}
                type="number"
                step="0.1"
                placeholder="Parcel Weight (KG)"
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.parcelWeight && (
                <span className="text-red-500 text-sm">{errors.parcelWeight.message}</span>
              )}
            </div>
          </div>

          {/* Sender & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Sender */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sender Details</h3>
              <div className="space-y-4">
                <input
                  {...register("senderName", { required: "Sender name is required" })}
                  type="text"
                  placeholder="Sender Name"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.senderName && (
                  <span className="text-red-500 text-sm">{errors.senderName.message}</span>
                )}

                <input
                  {...register("senderEmail", {
                    required: "Sender email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                  })}
                  type="email"
                  placeholder="Sender Email"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.senderEmail && (
                  <span className="text-red-500 text-sm">{errors.senderEmail.message}</span>
                )}

                <select
                  {...register("senderRegion", { required: "Sender region is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <span className="text-red-500 text-sm">{errors.senderRegion.message}</span>
                )}

                <select
                  {...register("senderWarehouse", { required: "Sender warehouse is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!senderRegion}
                >
                  <option value="">
                    {senderRegion ? "Select Warehouse / District" : "Select region first"}
                  </option>
                  {senderRegion &&
                    getDistrictByRegion(senderRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                {errors.senderWarehouse && (
                  <span className="text-red-500 text-sm">{errors.senderWarehouse.message}</span>
                )}

                <input
                  {...register("senderAddress", { required: "Sender address is required" })}
                  type="text"
                  placeholder="Address"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.senderAddress && (
                  <span className="text-red-500 text-sm">{errors.senderAddress.message}</span>
                )}

                <input
                  {...register("senderContact", { required: "Sender contact is required" })}
                  type="text"
                  placeholder="Sender Contact No"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.senderContact && (
                  <span className="text-red-500 text-sm">{errors.senderContact.message}</span>
                )}

                <textarea
                  {...register("pickupInstruction")}
                  placeholder="Pickup Instruction"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Receiver */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Receiver Details</h3>
              <div className="space-y-4">
                <input
                  {...register("receiverName", { required: "Receiver name is required" })}
                  type="text"
                  placeholder="Receiver Name"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.receiverName && (
                  <span className="text-red-500 text-sm">{errors.receiverName.message}</span>
                )}

                <select
                  {...register("receiverRegion", { required: "Receiver region is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <span className="text-red-500 text-sm">{errors.receiverRegion.message}</span>
                )}

                <select
                  {...register("receiverWarehouse", { required: "Receiver warehouse is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!receiverRegion}
                >
                  <option value="">
                    {receiverRegion ? "Select Warehouse / District" : "Select region first"}
                  </option>
                  {receiverRegion &&
                    getDistrictByRegion(receiverRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                {errors.receiverWarehouse && (
                  <span className="text-red-500 text-sm">{errors.receiverWarehouse.message}</span>
                )}

                <input
                  {...register("receiverAddress", { required: "Receiver address is required" })}
                  type="text"
                  placeholder="Receiver Address"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.receiverAddress && (
                  <span className="text-red-500 text-sm">{errors.receiverAddress.message}</span>
                )}

                <input
                  {...register("receiverContact", { required: "Receiver contact is required" })}
                  type="text"
                  placeholder="Receiver Contact No"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.receiverContact && (
                  <span className="text-red-500 text-sm">{errors.receiverContact.message}</span>
                )}

                <textarea
                  {...register("deliveryInstruction")}
                  placeholder="Delivery Instruction"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">* PickUp Time 4pm-7pm Approx.</p>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-[#CAEB66] px-6 py-3 rounded-lg font-semibold"
            >
              Proceed to Confirm Booking
            </button>
          </div>
        </form>
      ) : (
        // ====== CONFIRMATION ======
        <div>
          <h3 className="text-xl font-bold mb-4 text-center">
            Confirm Your Parcel Booking
          </h3>

          <div className="bg-gray-50 border rounded-lg p-6 mb-6">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="font-medium">Tracking ID</td>
                  <td>{confirmData?.trackingId}</td>
                </tr>
                <tr>
                  <td className="font-medium">Status</td>
                  <td>{confirmData?.status}</td>
                </tr>
                <tr>
                  <td className="font-medium">Parcel Type</td>
                  <td>{confirmData?.parcelType}</td>
                </tr>
                <tr>
                  <td className="font-medium">Weight</td>
                  <td>{confirmData?.parcelWeight} kg</td>
                </tr>
                <tr>
                  <td className="font-medium">Sender Email</td>
                  <td>{confirmData?.senderEmail}</td>
                </tr>
                <tr>
                  <td className="font-medium">Created By</td>
                  <td>{confirmData?.createdBy}</td>
                </tr>
                <tr>
                  <td className="font-medium">Created At</td>
                  <td>
                    {confirmData?.createdAt
                      ? new Date(confirmData.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="font-bold">Price Breakdown</td>
                  <td>
                    {priceBreak?.selected?.lines?.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </td>
                </tr>

                <tr>
                  <td className="font-bold">Total Cost</td>
                  <td>৳{priceBreak?.selected?.total ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleFinalConfirm}
              className="bg-[#CAEB66] px-6 py-3 rounded-lg font-semibold"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => {
                setConfirmData(null);
                setPriceBreak(null);
              }}
              className="bg-gray-300 px-6 py-3 rounded-lg"
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
