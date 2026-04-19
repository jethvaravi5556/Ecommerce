import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaStar, FaStarHalf } from "react-icons/fa";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import SaveButton from "../components/SaveButton";

const ProductDetails = () => {
  const user = useSelector((state) => state.user.user);

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [buyLoading, setBuyLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [ratingData, setRatingData] = useState({
    avgRating: 0,
    totalReview: 0,
  });

  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [activeImage, setActiveImage] = useState(null);
  const [zoomImageCordinator, setZoomImageCordinator] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);

  const productImageListLoading = new Array(4).fill(null);
  const params = useParams();

  const fetchRating = async () => {
    const res = await fetch(`${SummaryApi.ratingAverage.url}/${params.id}`);
    const data = await res.json();
    setRatingData(data.data);
  };

  const fetchReviews = async () => {
    const res = await fetch(`${SummaryApi.productReview.url}/${params.id}`);
    const data = await res.json();
    setReviews(data.data);
  };

  const fetchProductDetails = async () => {
    let apiUrl = SummaryApi.productDetails.url.trim().replace(/\u200B/g, "");

    setLoading(true);

    const response = await fetch(apiUrl, {
      method: SummaryApi.productDetails.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });

    setLoading(false);

    const dataResponse = await response.json();

    setData(dataResponse?.data);
    setActiveImage(dataResponse?.data?.productImage?.[0] || null);
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${SummaryApi.updateReview.url}/${reviewId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: editRating,
            comment: editComment,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setEditId(null);
        setEditRating(5);
        setEditComment("");
        fetchReviews();
        fetchRating();
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${SummaryApi.deleteReview.url}/${reviewId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchReviews();
        fetchRating();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchRating();
    fetchReviews();
  }, [params.id]);

  useEffect(() => {
    if (!data?._id) return;

    let recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    recent = recent.filter((id) => id !== data._id);
    recent.unshift(data._id);

    if (recent.length > 8) {
      recent.pop();
    }

    localStorage.setItem("recentlyViewed", JSON.stringify(recent));
  }, [data]);

  const handleMouseEnterProduct = (imgURL) => {
    setActiveImage(imgURL);
  };

  const handleThumbnailClick = (imgURL) => {
    setActiveImage(imgURL);
  };

  const handleZoomImage = useCallback((e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setZoomImageCordinator({ x, y });
    setZoomImage(true);
  }, []);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyButton = async () => {
    try {
      setBuyLoading(true);

      const apiUrl = SummaryApi.payment.url.trim().replace(/\u200B/g, "");

      const response = await fetch(apiUrl, {
        method: SummaryApi.payment.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: [
            {
              productId: data,
              quantity: 1,
            },
          ],
          isDirectBuy: true,
        }),
      });

      const responseData = await response.json();

      if (responseData?.url) {
        window.location.href = responseData.url;
      } else {
        setBuyLoading(false);
        toast.error("Payment session failed");
      }
    } catch (err) {
      setBuyLoading(false);
      toast.error("Something went wrong");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(<FaStar key={i} />);
    }

    if (half) {
      stars.push(<FaStarHalf key="half" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto p-4 px-12">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/* IMAGE SECTION */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 relative">
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-96 lg:h-96 bg-slate-200 mx-auto overflow-hidden"
            onMouseMove={handleZoomImage}
            onMouseLeave={() => setZoomImage(false)}
          >
            <SaveButton productId={data?._id} />

            {activeImage && (
  <img
    src={activeImage}
    className="h-full w-full object-contain mix-blend-multiply pointer-events-none"
    alt={data?.productName}
  />
)}

            {zoomImage && (
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-gray-400 overflow-hidden shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${zoomImageCordinator.x}%`,
                  top: `${zoomImageCordinator.y}%`,
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomImageCordinator.x}% ${zoomImageCordinator.y}%`,
                }}
              />
            )}
          </div>

          {zoomImage && (
            <div className="absolute left-full ml-6 top-10 w-[400px] h-[400px] overflow-hidden bg-slate-200 p-2 shadow-lg rounded-3xl">
              <div
                className="w-full h-full mix-blend-multiply scale-150"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${zoomImageCordinator.x}% ${zoomImageCordinator.y}%`,
                }}
              />
            </div>
          )}

          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none">
                {productImageListLoading.map((_, index) => (
                  <div key={index} className="h-20 w-20 bg-slate-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none">
                {data?.productImage?.map((imgURL) => (
                  <div
                    key={imgURL}
                    className={`h-20 w-20 bg-slate-200 rounded p-1 cursor-pointer border-2 ${
                      activeImage === imgURL
                        ? "border-red-600"
                        : "border-transparent"
                    }`}
                  >
                    {imgURL && (
  <img
    src={imgURL}
    className="h-full w-full object-scale-down mix-blend-multiply cursor-pointer"
    onMouseEnter={() => handleMouseEnterProduct(imgURL)}
    onClick={() => handleThumbnailClick(imgURL)}
    alt={data?.productName}
  />
)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DETAILS */}
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
                {renderStars(ratingData.avgRating)}
                <span className="text-black ml-2">
                  ({ratingData.totalReview})
                </span>
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
                  disabled={buyLoading}
                  onClick={handleBuyButton}
                  className={`border-2 border-red-600 rounded px-3 py-1 min-w-[130px] font-medium flex items-center justify-center gap-2
  ${
    buyLoading
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "text-red-600 hover:bg-red-600 hover:text-white"
  }`}
                >
                  {buyLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    "Buy"
                  )}
                </button>
                {buyLoading && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-xl text-lg font-medium">
                      Redirecting to payment...
                    </div>
                  </div>
                )}
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

      {/* GIVE REVIEW */}
      <div className="mb-6">
        {!reviews.some(
          (r) => String(r.userId?._id) === String(user?._id || user?.id),
        ) && (
          <>
            <select
              value={userRating}
              onChange={(e) => setUserRating(Number(e.target.value))}
              className="border p-1"
            >
              <option value={5}>5 Star</option>
              <option value={4}>4 Star</option>
              <option value={3}>3 Star</option>
              <option value={2}>2 Star</option>
              <option value={1}>1 Star</option>
            </select>

            <textarea
              className="border w-full mt-2 p-2"
              placeholder="Write review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
              onClick={async () => {
                await fetch(SummaryApi.addReview.url, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    productId: params.id,
                    rating: userRating,
                    comment,
                  }),
                });

                setComment("");
                fetchReviews();
                fetchRating();
              }}
            >
              Submit
            </button>
          </>
        )}
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Customer Reviews</h3>

        {reviews.map((rev) => {
          const isOwn = String(rev.userId?._id) === String(user?._id);

          return (
            <div key={rev._id} className="border-b py-3">
              <div className="flex items-center gap-2">
                <img
                  src={rev.userId?.profilePic}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-medium">{rev.userId?.name}</p>
              </div>

              {editId === rev._id && isOwn ? (
                <div className="mt-2">
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border p-1"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>

                  <textarea
                    className="border w-full mt-2 p-2"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />

                  <button
                    className="bg-green-600 text-white px-2 py-1 mt-2 mr-2"
                    onClick={() => handleUpdateReview(rev._id)}
                  >
                    Update
                  </button>

                  <button
                    className="bg-gray-400 text-white px-2 py-1 mt-2"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-red-600 flex gap-1">
                    {renderStars(rev.rating)}
                  </div>

                  <p className="text-sm mt-1">{rev.comment}</p>

                  {isOwn && (
                    <div className="flex gap-4 mt-2">
                      <button
                        className="text-blue-600 text-sm"
                        onClick={() => {
                          setEditId(rev._id);
                          setEditRating(rev.rating);
                          setEditComment(rev.comment);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-600 text-sm"
                        onClick={() => handleDeleteReview(rev._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {data.category && (
        <div className="mt-10">
          <CategoryWiseProductDisplay
            category={data?.category}
            heading={"Recommended Products"}
            excludeProductId={data?._id}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
