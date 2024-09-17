"use client"; // Ensure this component is a client component

import { useCart } from "@/app/_context/CartContext"; // Client-side hook
import ErrorPage from "@/app/error-page";
import { Button as CustomButton } from "@/components/custom/button";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const BagPageContent = () => {
  const { cart, refreshCart, isError } = useCart();
  const [loading, setLoading] = useState(true);
  const [isCheckoutError, setIsCheckoutError] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  let totalPrice = 0;

  useEffect(() => {
    // Simulate a loading delay (e.g., when fetching data from API)
    setTimeout(() => {
      setLoading(false);
    }, 1000); // You can adjust the delay time
  }, []);

  if (Array.isArray(cart)) {
    cart.forEach((item: any) => {
      totalPrice += item.price * item.quantity;
    });
  }

  const deleteItem = async (item: any) => {
    try {
      const resp = await axios.delete(`/api/store/cart/${item.id}`);
      if (resp.status === 200) {
        toast.success("Product removed from cart");
        refreshCart();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const resp = await axios.post("/api/store/checkout");

      window.location.href = `${resp.data}`;
    } catch (err) {
      console.log(err);
      setCheckoutLoading(false);
      setIsCheckoutError(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isError || isCheckoutError) {
    return <ErrorPage />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 min-h-[55vh]">
      {loading ? (
        // Skeleton Loader
        <div className="animate-pulse flex flex-col gap-y-10">
          {Array(3)
            .fill("")
            .map((_, idx) => (
              <div key={idx} className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-md" />
                <div className="ml-5 flex justify-between w-full font-medium">
                  <div className="flex flex-col justify-between w-full">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                  <div className="flex flex-col justify-between w-1/4">
                    <div className="h-4 bg-gray-300 rounded mb-2" />
                    <div className="h-4 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            ))}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-300 rounded w-1/6" />
            </div>
            <div className="mt-5 w-full h-12 bg-gray-300 rounded-md" />
          </div>
        </div>
      ) : !Array.isArray(cart) || cart.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">
            You don&#39;t have any items in your bag
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            You currently don&#39;t have any products in your shopping bag.
            Please add some so that you can see them right here.
          </p>

          <Button asChild>
            <Link href={"/"}>Shop Now!</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-10">
          {Array.isArray(cart) &&
            cart.map((item: any) => (
              <div key={item.id} className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                  <Image
                    alt="product image"
                    src={item.imageString}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="ml-5 flex justify-between w-full font-medium">
                  <p>{item.name}</p>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center gap-x-2">
                      <p>{item.quantity} x</p>
                      <p>${item.price}</p>
                    </div>
                    <p
                      onClick={() => deleteItem(item)}
                      className="font-medium cursor-pointer text-primary text-end"
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          <div className="mt-10">
            <div className="flex items-center justify-between font-medium">
              <p>Subtotal:</p>
              <p>${new Intl.NumberFormat("en-US").format(totalPrice)}</p>
            </div>
            <CustomButton
              loading={checkoutLoading}
              onClick={handleCheckout}
              size={"lg"}
              className="mt-5 w-full"
            >
              Checkout
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagPageContent;
