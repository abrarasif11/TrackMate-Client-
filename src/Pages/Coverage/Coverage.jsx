// src/Pages/Coverage/Coverage.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";

const Coverage = () => {
  const serviceCenter = useLoaderData();
  console.log(serviceCenter)
  const [search, setSearch] = useState("");

  

  return (
    <div className=" bg-white  py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">
          We are available in <span className="text-slate-800">64 districts</span>
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-10">
          <div className="flex items-center bg-slate-100 rounded-full shadow-sm overflow-hidden">
            {/* Search Icon */}
            <span className="pl-4 text-gray-500">
              <Search size={20} />
            </span>

            {/* Input */}
            <input
              type="text"
              placeholder="Search here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow bg-transparent outline-none px-3 py-3 text-gray-700 placeholder-gray-400"
            />

            {/* Button */}
            <button className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-7 py-3 rounded-full transition">
              Search
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Subtitle */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          We deliver almost all over Bangladesh
        </h2>
       <BangladeshMap
       serviceCenter={serviceCenter}
       />
      </div>
    </div>
  );
}
export default Coverage;