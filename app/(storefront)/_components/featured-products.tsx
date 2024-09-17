"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./product-card";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const resp = await axios.get("/api/store/products/featured");
        setFeaturedProducts(resp.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedProducts();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-extrabold tracking-tight">Featured Items</h2>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          // Loading skeleton
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 border rounded-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : featuredProducts.length > 0 ? (
          featuredProducts.map((product: any) => (
            <ProductCard key={product._id} item={product} />
          ))
        ) : (
          // Message for empty products array
          <div className="text-gray-500 text-lg">No featured products available.</div>
        )}
      </div>
    </>
  );
};

export default FeaturedProducts;
