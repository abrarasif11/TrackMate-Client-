import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

// FlyToDistrict helper
function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 12, { duration: 1.5 });
  }
  return null;
}

const BangladeshMap = ({ serviceCenter }) => {
  const [searchText, setSearchText] = useState("");
  const [activeCoords, setActiveCoords] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    // Case-insensitive district search
    const district = serviceCenter.find((d) =>
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );

    if (district) {
      setActiveCoords([district.latitude, district.longitude]);
      setActiveDistrict(district.district);
    } else {
      alert("No matching district found!");
    }
  };

  // Center of Bangladesh
  const bangladeshPosition = [23.685, 90.3563];

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div className="w-full max-w-xl mb-10">
          <div className="flex items-center bg-slate-100 rounded-full shadow-sm overflow-hidden">
            {/* Search Icon */}
            <span className="pl-4 text-gray-500">
              <Search size={20} />
            </span>

            {/* Input */}
            <input
              type="text"
              placeholder="Search district..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-grow bg-transparent outline-none px-3 py-3 text-gray-700 placeholder-gray-400"
            />

            {/* Button */}
            <button
              type="submit"
              className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-7 py-3 rounded-full transition"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Map Section */}
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

          {/* Fly to searched district */}
          <FlyToDistrict coords={activeCoords} />

          {/* Markers for all service centers */}
          {serviceCenter.map((center, idx) => (
            <Marker key={idx} position={[center.latitude, center.longitude]}>
              <Popup autoOpen={center.district === activeDistrict}>
                <strong>{center.district}</strong>
                <br />
                {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
