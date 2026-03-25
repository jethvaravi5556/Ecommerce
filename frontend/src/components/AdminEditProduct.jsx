import React, { useState, useEffect } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const AdminEditProduct = ({ productData, onClose, fetchData }) => {
  const [data, setData] = useState({
    ...productData,
    productImage: productData?.productImage || [],
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  // prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
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
    if (!file) return toast.error("No file selected");

    try {
      const res = await uploadImage(file);

      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, res.url],
      }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleDeleteProductImage = (index) => {
    const arr = [...data.productImage];
    arr.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: arr,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !data.productName ||
      !data.brandName ||
      !data.category ||
      !data.productImage.length
    ) {
      return toast.error("All fields required");
    }

    try {
      const response = await fetch(SummaryApi.updateProduct.url, {
        method: SummaryApi.updateProduct.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.message);
        onClose();
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 w-full max-w-2xl rounded-lg h-[80%] overflow-hidden">
        <h2 className="font-bold text-lg pb-3">Edit Product</h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-2 p-4 h-full overflow-y-auto"
        >
          <label>Product Name</label>
          <input
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border rounded"
          />

          <label className="mt-3">Brand Name</label>
          <input
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border rounded"
          />

          <label className="mt-3">Category</label>
          <select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border rounded"
          >
            <option value="">Select</option>
            {productCategory.map((c, i) => (
              <option key={i} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="mt-3">Product Image</label>

          <label>
            <div className="h-32 border bg-slate-100 flex justify-center items-center cursor-pointer">
              <FaCloudUploadAlt size={40} />
              <input
                type="file"
                className="hidden"
                onChange={handleUploadProduct}
              />
            </div>
          </label>

          <div className="flex gap-2 flex-wrap">
            {data.productImage.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img}
                  width={80}
                  className="border cursor-pointer"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(img);
                  }}
                />

                <div
                  className="absolute bottom-0 right-0 bg-red-500 text-white p-1 hidden group-hover:block cursor-pointer"
                  onClick={() => handleDeleteProductImage(i)}
                >
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>

          <label className="mt-3">Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border rounded"
          />

          <label className="mt-3">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border rounded"
          />

          <label className="mt-3">Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleOnChange}
            className="bg-slate-100 p-2 border h-28 resize-none"
          />

          <div className="flex justify-between mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button className="bg-red-600 text-white px-4 py-2 rounded">
              Update Product
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          imgurl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
