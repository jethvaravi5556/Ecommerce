import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      <HorizontalCardProduct category={"airpods"} heading={"Top's Airpodes"} />
      <HorizontalCardProduct
        category={"earphones"}
        heading={"Popular's Earphones"}
      />

      <VerticalCardProduct
        category={"camera"}
        heading={"Camera & Photography"}
      />
      <VerticalCardProduct category={"mobile"} heading={"Mobiles"} />
      <VerticalCardProduct category={"mouse"} heading={"Mouses"} />
      <VerticalCardProduct category={"printers"} heading={"Printers"} />
      <VerticalCardProduct category={"speakers"} heading={"Speakers"} />
      <VerticalCardProduct category={"watches"} heading={"watches"} />
      <Footer />
    </div>
  );
};

export default Home;
