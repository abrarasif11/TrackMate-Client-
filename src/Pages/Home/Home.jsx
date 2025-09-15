import React from "react";
import Banner from "./Banner/Banner";
import HowItWorks from "./HowItWorks/HowItWorks";
import Services from "./Services/Services";
import Brand from "./Brand/Brand";
import Benefits from "./Benefits/Benefits";
import BeMerchant from "./BeMerchant/BeMerchant";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <Brand />
      <Benefits />
      <BeMerchant />
    </div>
  );
};

export default Home;
