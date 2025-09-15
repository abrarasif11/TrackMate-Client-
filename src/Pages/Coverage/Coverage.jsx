// src/Pages/Coverage/Coverage.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Coverage() {
  const [search, setSearch] = useState("");

  // Center Bangladesh
  const bangladeshPosition = [23.685, 90.3563];

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

        {/* Map Section (React Leaflet) */}
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
          <MapContainer
            center={bangladeshPosition}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Example marker on Dhaka */}
            <Marker position={[23.8103, 90.4125]}>
              <Popup>Dhaka – Central Hub of Our Parcel Coverage</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
