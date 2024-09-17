"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "../../_components/product-card";
import { CircuitBoard, EyeOffIcon, GlassesIcon, NotebookTabsIcon, Salad } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ErrorPage from "@/app/error-page";

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col space-y-3 p-5 border border-gray-300 rounded-lg">
    <div className="bg-gray-300 h-48 w-full rounded-lg"></div>
    <div className="bg-gray-300 h-6 w-3/4 rounded-lg"></div>
    <div className="bg-gray-300 h-4 w-1/2 rounded-lg"></div>
    <div className="bg-gray-300 h-6 w-1/3 rounded-lg"></div>
  </div>
);

function CategoryPage({ params }: { params: { name: string } }) {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [isError, setError] = useState<boolean>(false); // Add error

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(
          `/api/store/products/category/${params.name}`
        );
        setProducts(resp.data);
      } catch (err) {
        console.log(err);
        setError(true);
        setProducts([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    getData();
  }, [params]);

  if(isError){
    return <ErrorPage />
  }

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5">
        {params.name
          .toLocaleLowerCase()
          .replace(
            /^(.)(.*)$/,
            (_, first, rest) => first.toUpperCase() + rest
          )}{" "}
        Products
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />) // Display 6 skeletons while loading
          : products.length > 0
          ? products.map((product: any) => (
              <ProductCard key={product._id} item={product} />
            ))
          : !loading && (
              <div className="col-span-3 flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <GlassesIcon className="w-10 h-10 text-primary" />
                </div>
                <h2 className="mt-6 text-xl font-semibold">
                  No Products Found
                </h2>
                <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                  It looks like there are no products available at the moment.
                  Please explore our catalog and add items to see them here.
                </p>

                <Button asChild>
                  <Link href={"/"}>Go Back!</Link>
                </Button>
              </div>
            )}
      </div>
    </section>
  );
}

export default CategoryPage;
