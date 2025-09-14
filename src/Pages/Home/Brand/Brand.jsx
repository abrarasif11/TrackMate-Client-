// src/Pages/Home/Clients.jsx
import React from "react";
import Marquee from "react-fast-marquee";

// Import client logos
import client1 from "../../../assets/brands/amazon.png";
import client2 from "../../../assets/brands/moonstar.png";
import client3 from "../../../assets/brands/casio.png";
import client4 from "../../../assets/brands/amazon_vector.png";
import client5 from "../../../assets/brands/randstad.png";
import client6 from "../../../assets/brands/start-people 1.png";
import client7 from "../../../assets/brands/start.png";

const logos = [client1, client2, client3, client4, client5, client6, client7];

const Brand = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-20">
          We've helped thousands of sales teams
        </h2>

        {/* Marquee Component */}
        <Marquee
          gradient={false} // remove fade effect on edges
          speed={50} // control speed
          pauseOnHover={true} // stop when user hovers
        >
          {logos.map((logo, idx) => (
            <div key={idx} className="mx-12">
              <img
                src={logo}
                alt="Client Logo"
                className="h-[24px] w-[176px] object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Brand;
