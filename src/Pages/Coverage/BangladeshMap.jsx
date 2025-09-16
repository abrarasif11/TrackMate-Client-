import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const BangladeshMap = ({ serviceCenter }) => {
  // Center Bangladesh
  const bangladeshPosition = [23.685, 90.3563];
  return (
    <div>
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
          {serviceCenter.map((center, idx) => (
            <Marker
            key={idx}
            position={[center.latitude, center.longitude]}
            // icon={}
            >
              <Popup>Dhaka – Central Hub of Our Parcel Coverage</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
