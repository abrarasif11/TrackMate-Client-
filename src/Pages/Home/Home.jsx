import React from "react";
import Banner from "./Banner/Banner";
import HowItWorks from "./HowItWorks/HowItWorks";
import Services from "./Services/Services";
import Brand from "./Brand/Brand";
import Benefits from "./Benefits/Benefits";
import BeMerchant from "./BeMerchant/BeMerchant";
import Review from "./Review/Review";
import FAQ from "./FAQ/FAQ";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <Brand />
      <Benefits />
      <BeMerchant />
      <Review />
      <FAQ />
    </div>
  );
};

export default Home;
