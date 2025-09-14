import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-[1650px] mx-auto">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
