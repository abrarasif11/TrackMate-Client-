import React from "react";
import Banner from "./Banner/Banner";
import HowItWorks from "./HowItWorks/HowItWorks";
import Services from "./Services/Services";
import Brand from "./Brand/Brand";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <Brand />
    </div>
  );
};

export default Home;
