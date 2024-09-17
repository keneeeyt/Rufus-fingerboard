"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageSlider from "../../_components/image-slider";
import { ShoppingBag, StarIcon } from "lucide-react";
import FeaturedProducts from "../../_components/featured-products";
import { toast } from "sonner";
import { Button } from "@/components/custom/button";
import { useCart } from "@/app/_context/CartContext";
import NotFound from "@/app/not-found";


function ProductIdPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [submitLoading, setSubmitLoading] = useState(false);
  const {refreshCart} = useCart();
  const [isError, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(`/api/product/${params.id}`);
        setProduct(resp.data);
      } catch (err: any) {
        console.log(err)
        if(err.status === 404) {
          setError(true)
        }
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    getData();
  }, [params]);

  const AddItem = async (params: { id: string }) => {
    setSubmitLoading(true);
    try {
      const resp = await axios.post(`/api/store/cart/${params.id}`);
      if (resp.status === 200) {
        toast.success("Product added to cart");
      }
      refreshCart();
    } catch (err: any) {
      console.log(err);
      if(err.status === 401) {
        toast.error("Please Sign in to add items to cart");
      }
      toast.error("Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  if(isError){
    return <NotFound />
  }

  return (
    <>
      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
            {/* Skeleton for Image Slider */}
            <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg" />
            <div>
              <div className="h-8 bg-gray-200 w-3/4 animate-pulse rounded-lg" />
              <div className="h-8 bg-gray-200 w-1/4 mt-2 animate-pulse rounded-lg" />
              <div className="mt-3 flex gap-1">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-24 bg-gray-200 w-full mt-6 animate-pulse rounded-lg" />
              <div className="h-12 bg-gray-200 w-full mt-5 animate-pulse rounded-lg" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
            <ImageSlider images={product?.product_images} />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900">
                {product?.product_name}
              </h1>
              <p className="text-3xl mt-2 text-gray-900">
                ${product?.product_price}
              </p>
              <div className="mt-3 flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-base text-gray-700 mt-6">
                {product?.product_description}
              </p>

              <Button
                onClick={() => AddItem(params)}
                size="lg"
                className="w-full mt-5"
                loading={submitLoading}
              >
                <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
              </Button>
            </div>
          </div>
          <div className="mt-16">
            <FeaturedProducts />
          </div>
        </>
      )}
    </>
  );
}

export default ProductIdPage;
