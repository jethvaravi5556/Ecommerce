import React, { useState, useEffect } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const AdminEditProduct = ({ productData, onClose, fetchData }) => {
  const MAX_PRICE = 10000000; // 1 crore limit (you can change)
  const MIN_PRICE = 1;
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "sellingPrice" ? Number(value) : value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      const uploadImageCloudinary = await uploadImage(file);
      const imageUrl =
        uploadImageCloudinary.secure_url || uploadImageCloudinary.url;

      if (!imageUrl) {
        throw new Error("Image upload returned invalid URL");
      }

      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, imageUrl],
      }));

      console.log("Uploaded Image URL:", imageUrl);
    } catch (error) {
      toast.error("Image upload failed.");
      console.error("Image Upload Error:", error);
    }
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: newProductImage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (data.productName.length < 3) {
      toast.error("Product name must be at least 3 characters");
      return;
    }

    if (data.price < MIN_PRICE || data.price > MAX_PRICE) {
      toast.error(`Price must be between ₹${MIN_PRICE} and ₹${MAX_PRICE}`);
      return;
    }

    if (data.sellingPrice < MIN_PRICE || data.sellingPrice > MAX_PRICE) {
      toast.error(
        `Selling price must be between ₹${MIN_PRICE} and ₹${MAX_PRICE}`,
      );
      return;
    }

    if (data.sellingPrice > data.price) {
      toast.error("Selling price cannot be greater than price");
      return;
    }

    try {
      const apiUrl = SummaryApi.updateProduct.url.trim().replace(/\u200B/g, "");

      const response = await fetch(apiUrl, {
        method: SummaryApi.updateProduct.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        onClose();
        fetchData();
      } else {
        console.error("API Error:", dataApi.message);
        toast.error(dataApi.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error connecting to the server");
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 max-h-[80%] shadow-md h-full w-full max-w-2xl rounded-lg overflow-hidden">
        <div className="font-bold text-lg pb-3">Edit Product</div>

        <form
          className="grid p-4 gap-2 h-full pb-5 overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter the Product Name"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="bg-slate-100 border rounded p-2"
            required
          />

          <label htmlFor="brandName" className="mt-4">
            Brand Name:
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="Enter the Brand Name"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="bg-slate-100 border rounded p-2"
            required
          />

          <label htmlFor="category" className="mt-4">
            Category:
          </label>

          <select
            value={data.category}
            name="category"
            onChange={handleOnChange}
            className="bg-slate-100 border rounded p-2"
            required
          >
            <option value="">Select Category:</option>
            {productCategory.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage" className="mt-4">
            Product Image:
          </label>

          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
              </div>

              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                onChange={handleUploadProduct}
              />
            </div>
          </label>

          {data.productImage.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {data.productImage.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt="Product"
                    width={80}
                    height={80}
                    className="bg-slate-100 border cursor-pointer"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(img);
                    }}
                  />

                  <div
                    className="absolute bottom-0 right-0 p-1 rounded-full bg-red-500 text-white hidden group-hover:block cursor-pointer"
                    onClick={() => handleDeleteProductImage(index)}
                  >
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          )}

          <label htmlFor="price" className="mt-4">
            Price:
          </label>

          <input
            type="number"
            name="price"
            min={1}
            max={10000000}
            step="1"
            value={data.price}
            onChange={handleOnChange}
            className="bg-slate-100 border rounded p-2"
          />

          <label htmlFor="sellingPrice" className="mt-4">
            Selling Price:
          </label>

          <input
            type="number"
            name="sellingPrice"
            min={1}
            max={10000000}
            step="1"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="bg-slate-100 border rounded p-2"
          />

          <label htmlFor="description" className="mt-4">
            Description:
          </label>

          <textarea
            className="h-28 bg-slate-100 border resize-none p-2"
            id="description"
            placeholder="Enter Product Description"
            name="description"
            value={data.description}
            onChange={handleOnChange}
            required
          />

          <div className="flex justify-between mt-6 mb-8">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-red-600 text-white rounded-md">
              Update Product
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgurl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
