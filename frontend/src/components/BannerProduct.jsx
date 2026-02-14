import React, { useEffect, useState } from "react";

import img1 from "../assest/banner/img1.webp";
import img2 from "../assest/banner/img2.webp";
import img3 from "../assest/banner/img3.jpg";
import img4 from "../assest/banner/img4.jpg";
import img5 from "../assest/banner/img5.webp";

import img1Mobile from "../assest/banner/img1_mobile.jpg";
import img2Mobile from "../assest/banner/img2_mobile.webp";
import img3Mobile from "../assest/banner/img3_mobile.jpg";
import img4Mobile from "../assest/banner/img4_mobile.jpg";
import img5Mobile from "../assest/banner/img5_mobile.png";

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const desktopImages = [img1, img2, img3, img4, img5];

  const mobileImages = [
    img1Mobile,
    img2Mobile,
    img3Mobile,
    img4Mobile,
    img5Mobile,
  ];

  const nextImage = () => {
    if (desktopImages.length - 1 > currentImage) {
      setCurrentImage((preve) => preve + 1);
    }
  };
  const preveImage = () => {
    if (0 < currentImage) {
      setCurrentImage((preve) => preve - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopImages.length - 1 > currentImage) {
        nextImage();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);
  return (
    <div className="container mx-auto px-4 rounded ">
      <div className="h-60 md:h-72 w-full bg-slate-200 relative">
        <div className="absolute z-10 h-full w-full md:flex items-center hidden">
          <div className="flex justify-between w-full text-2xl">
            <button
              onClick={preveImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* desktop and tablet */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURL, index) => {
            return (
              <div
                className="h-full w-full min-h-full min-w-full transition-all "
                key={imageURL}
                style={{ transform: `translatex(-${currentImage * 100}%)` }}
              >
                <img src={imageURL} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        {/* mobile */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageURL, index) => {
            return (
              <div
                className="h-full w-full min-h-full min-w-full transition-all "
                key={imageURL}
                style={{ transform: `translatex(-${currentImage * 100}%)` }}
              >
                <img src={imageURL} className="w-full h-full " />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;