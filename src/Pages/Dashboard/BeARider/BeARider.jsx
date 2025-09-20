import React from "react";
import { useForm } from "react-hook-form";
import rider from '../../../assets/assests/agent-pending.png'

const BeARider = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="mt-10 min-h-screen flex flex-col items-center py-10">
      <div className="max-w-6xl w-full bg-white shadow-md rounded-2xl p-10">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Be a Rider</h1>
        <p className="text-gray-500 mb-8 max-w-3xl">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Form Section */}
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
                    <option value="dhaka">Dhaka</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="rajshahi">Rajshahi</option>
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
                  <option value="uttara">Uttara</option>
                  <option value="mirpur">Mirpur</option>
                  <option value="dhanmondi">Dhanmondi</option>
                </select>
                {errors.warehouse && (
                  <p className="text-red-500 text-sm mt-1">
                    Warehouse selection is required
                  </p>
                )}
              </div>

              {/* Submit */}
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
