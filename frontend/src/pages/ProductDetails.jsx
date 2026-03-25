import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaStar, FaStarHalf } from "react-icons/fa";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCordinator, setZoomImageCordinator] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);
  const productImageListLoading = new Array(4).fill(null);
  const params = useParams();

  const fetchProductDetails = async () => {
    let apiUrl = SummaryApi.productDetails.url.trim().replace(/\u200B/g, "");
    setLoading(true);
    const response = await fetch(apiUrl, {
      method: SummaryApi.productDetails.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: params?.id }),
    });
    setLoading(false);
    const dataResponse = await response.json();
    setData(dataResponse?.data);
    setActiveImage(dataResponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imgURL) => {
    setActiveImage(imgURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomImageCordinator({ x, y });
  }, []);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyButton = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };
  return (
    <div className="container mx-auto p-4 px-12 ">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/* Product Images */}
        <div className="flex flex-col lg:flex-row-reverse gap-4">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-96 lg:h-96 bg-slate-200 mx-auto">
            <img
              src={activeImage}
              className="h-full w-full object-contain mix-blend-multiply"
              onMouseEnter={() => setZoomImage(true)}
              onMouseMove={handleZoomImage}
              onMouseLeave={() => setZoomImage(false)}
            />
          </div>

          {/* Zoomed image */}
          {zoomImage && (
            <div className="absolute min-h-[400px] min-w-[500px] overflow-hidden bg-slate-200 p-1 right-[500px] top-[10px]">
              <div
                className="h-full w-full min-h-[400px] min-w-[400px] mix-blend-multiply scale-150"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${zoomImageCordinator.x}% ${zoomImageCordinator.y}%`,
                }}
              ></div>
            </div>
          )}

          {/* Thumbnail Images */}
          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none">
                {productImageListLoading.map((_, index) => (
                  <div
                    key={index}
                    className="h-20 w-20 bg-slate-200 rounded"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none">
                {data?.productImage?.map((imgURL) => (
                  <div
                    key={imgURL}
                    className="h-20 w-20 bg-slate-200 rounded p-1"
                  >
                    <img
                      src={imgURL}
                      className="h-full w-full object-scale-down mix-blend-multiply cursor-pointer"
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <p className="h-6 bg-slate-200 rounded w-1/3"></p>
              <p className="h-6 bg-slate-200 rounded w-2/3"></p>
              <p className="h-6 bg-slate-200 rounded w-1/4"></p>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded w-full"></div>
              <div className="h-20 bg-slate-200 rounded w-full"></div>
            </div>
          ) : (
            <>
              <p className="text-red-600 bg-red-200 px-2 rounded-full w-fit">
                {data?.brandName}
              </p>
              <h2 className="text-2xl lg:text-4xl font-medium">
                {data?.productName}
              </h2>
              <p className="capitalize text-slate-400">{data?.category}</p>

              <div className="text-red-600 flex items-center gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <div className="flex gap-2 items-center text-xl font-medium my-1">
                <p className="text-red-500">
                  {displayINRCurrency(data?.sellingPrice)}
                </p>
                <p className="text-slate-500 line-through">
                  {displayINRCurrency(data?.price)}
                </p>
              </div>

              <div className="flex items-center gap-3 my-2">
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[100px] text-red-600 font-medium hover:bg-red-600 hover:text-white"
                  onClick={(e) => handleBuyButton(e, data?._id)}
                >
                  Buy
                </button>
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[100px] text-white bg-red-600 font-medium hover:text-red-600 hover:bg-white"
                  onClick={(e) => handleAddToCart(e, data._id)}
                >
                  Add to Cart
                </button>
              </div>

              <div>
                <p className="text-slate-600 font-medium my-2">Description:</p>
                <p>{data?.description}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {data.category && (
        <div className="mt-10">
          <CategoryWiseProductDisplay
            category={data?.category}
            heading={"Recommended Products"}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
