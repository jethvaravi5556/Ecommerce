import React, { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";

const AdminProductCard = ({ data, fetchData, onDelete }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow w-[220px] h-[260px] flex flex-col justify-between">
      {/* Image */}
      <div className="w-full h-[120px] flex justify-center items-center">
        <img
          src={data.productImage[0]}
          alt={data.productName}
          className="max-h-full object-contain"
        />
      </div>

      {/* Product Name */}
      <h1 className="text-sm font-medium line-clamp-2 h-[40px]">
        {data.productName}
      </h1>

      {/* Price + Actions */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">
          {displayINRCurrency(data.sellingPrice)}
        </p>

        <div className="flex gap-2">
          {/* Edit */}
          <div
            className="p-2 rounded-full bg-green-200 cursor-pointer hover:bg-green-600 hover:text-white"
            onClick={() => setEditProduct(true)}
          >
            <MdModeEditOutline />
          </div>

          {/* Delete */}
          <div
            className="p-2 rounded-full bg-red-200 cursor-pointer hover:bg-red-600 hover:text-white"
            onClick={() => onDelete(data._id)}
          >
            <MdDelete />
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
