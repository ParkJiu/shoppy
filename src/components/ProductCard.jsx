import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, type }) {
  const navigate = useNavigate();
  const isList = type === "list";
  return (
    <li
      className={`p-2 ${isList ? "cursor-pointer" : "cursor-default flex "}`}
      onClick={() =>
        navigate(`/products/detail/${product.id}`, { state: { product } })
      }
    >
      <img
        className={`${isList ? "w-full" : "w-2/4 xl:w-1/4"} mb-2`}
        src={product.img_url}
        alt={product.title}
      />
      <div
        className={`flex flex-col ${
          isList ? "w-[200px] mx-auto text-center" : "w-[450px] ml-4"
        }`}
      >
        <span className={`${!isList && "text-xl"}`}>{product.title}</span>
        {!isList && <div className=' my-2 border-t border-gray-300'></div>}
        <span>{`${!isList ? "가격" : ""} ${product.price}`}</span>
        <span>{product.gender}</span>
      </div>
    </li>
  );
}
