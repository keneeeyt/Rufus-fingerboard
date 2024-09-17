"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import all from "@/public/all.jpg";
import axios from "axios";

const CategorySelection = () => {
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get("/api/category");
        setCategories(resp.data);
      } catch (err) {
        console.log(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="py-24 sm:py-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">Shop by Category</h2>

        <Link
          href={"/products/all"}
          className="text-sm font-semibold text-primary hover:text-primary/80 "
        >
          Browse all Products &rarr;
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
        {/* All Products Card */}
        {loading ? (
          <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:aspect-w-1 sm:row-span-2 animate-pulse bg-gray-200">
            <div className="h-full w-full bg-gray-300" />
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ) : (
          <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:aspect-w-1 sm:row-span-2">
            <Image src={all} alt="all product" className="object-center object-cover" />
            <div className="bg-gradient-to-b from-transparent to-black opacity-65" />
            <div className="p-6 flex items-end">
              <Link href={"/products/all"}>
                <h3 className="text-white font-semibold">All Products</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>
        )}

        {/* Category Cards */}
        {loading ? (
          // Loading skeleton for categories
          <>
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full animate-pulse bg-gray-200"
              >
                <div className="h-full w-full bg-gray-300" />
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          categories.length > 0 &&
          categories.map((category: any, index: any) =>
            index < 2 ? (
              <div
                key={category._id}
                className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full"
              >
                <Image
                  src={category.category_image}
                  width={400}
                  height={400}
                  alt={category.category_name}
                  className="object-center object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full"
                />
                <div className="bg-gradient-to-b from-transparent to-black opacity-65 sm:absolute sm:inset-0" />
                <div className="p-6 flex items-end sm:absolute sm:inset-0">
                  <Link href={`/products/${category.category_name}`}>
                    <h3 className="text-white font-semibold">
                      {category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}
                    </h3>
                    <p className="mt-1 text-sm text-white">Shop Now</p>
                  </Link>
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default CategorySelection;
