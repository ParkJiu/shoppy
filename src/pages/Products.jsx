import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/firebase.js";

export default function Products() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  return (
    <div>
      <ul className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4'>
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            type='list'
          ></ProductCard>
        ))}
      </ul>
    </div>
  );
}
