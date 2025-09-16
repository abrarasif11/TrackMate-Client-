// src/Pages/Coverage/Coverage.jsx



import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";

const Coverage = () => {
  const serviceCenter = useLoaderData();
  console.log(serviceCenter);
  // const [search, setSearch] = useState("");

  return (
    <div className=" bg-white  py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">
          We are available in{" "}
          <span className="text-slate-800">64 districts</span>
        </h1>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Subtitle */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          We deliver almost all over Bangladesh
        </h2>
        <BangladeshMap serviceCenter={serviceCenter} />
      </div>
    </div>
  );
};
export default Coverage;
