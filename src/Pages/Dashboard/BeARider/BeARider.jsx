import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import rider from "../../../assets/assests/agent-pending.png";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const BeARider = () => {
  const serviceCenter = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Prefill email & name when user is available
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
    if (user?.displayName) {
      setValue("name", user.displayName);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      // POST form data to backend
      const res = await axiosSecure.post("/riders", data);
      console.log("MongoDB Response:", res.data.insertedId);

      Swal.fire({
        title: "Application Submitted!",
        html: `
          <strong>Name:</strong> ${data.name} <br/>
          <strong>Age:</strong> ${data.age} <br/>
          <strong>Email:</strong> ${data.email} <br/>
          <strong>Region:</strong> ${data.region} <br/>
          <strong>NID:</strong> ${data.nid} <br/>
          <strong>Contact:</strong> ${data.contact} <br/>
          <strong>Warehouse:</strong> ${data.warehouse}
        `,
        icon: "success",
        confirmButtonText: "OK",
      });
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        age: "",
        nid: "",
        contact: "",
        region: "",
        warehouse: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Submission Failed",
        text: "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Extract unique regions from serviceCenter
  const uniqueRegions = [...new Set(serviceCenter?.map((item) => item.region))];

  return (
    <div className="mt-10 min-h-screen flex flex-col items-center py-10">
      <div className="max-w-6xl w-full bg-white shadow-md rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Be a Rider</h1>
        <p className="text-gray-500 mb-8 max-w-3xl">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Tell us about yourself
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name and Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      Name is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Age
                  </label>
                  <input
                    type="number"
                    {...register("age", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Your Age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">Age is required</p>
                  )}
                </div>
              </div>

              {/* Email and Region */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Your Email"
                    readOnly={!!user?.email} // Prevent editing if already logged in
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      Email is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Region
                  </label>
                  <select
                    {...register("region", { required: true })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your region</option>
                    {uniqueRegions.map((region, idx) => (
                      <option key={idx} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1">
                      Region is required
                    </p>
                  )}
                </div>
              </div>

              {/* NID and Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    NID No
                  </label>
                  <input
                    type="text"
                    {...register("nid", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="NID"
                  />
                  {errors.nid && (
                    <p className="text-red-500 text-sm mt-1">NID is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    {...register("contact", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Contact"
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      Contact is required
                    </p>
                  )}
                </div>
              </div>

              {/* Warehouse */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Which warehouse you want to work?
                </label>
                <select
                  {...register("warehouse", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select warehouse</option>
                  {serviceCenter?.map((center) => (
                    <option key={center._id} value={center.district}>
                      {center.district}
                    </option>
                  ))}
                </select>
                {errors.warehouse && (
                  <p className="text-red-500 text-sm mt-1">
                    Warehouse selection is required
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn bg-[#CAEB66] text-black w-full"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:block">
            <img
              src={rider}
              alt="Rider illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
