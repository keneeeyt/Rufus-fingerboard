"use client";
import ErrorPage from "@/app/error-page";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrderPage = () => {
  const [orders, setOrders] = useState<any>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get("/api/store/order");
        setOrders(resp.data);
      } catch (err) {
        console.log(err);
        setIsError(true); // Fixing to set error state as true on failure
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (isError) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto h-[80vh]">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row justify-between items-center border-b-2 py-7"
            >
              {/* Left side skeleton */}
              <div className="flex justify-center lg:justify-start lg:space-x-4 mb-4 lg:mb-0 space-x-3">
                <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                <div className="space-y-2 lg:pl-4">
                  <div className="bg-gray-300 rounded-lg w-32 h-6"></div>
                  <div className="bg-gray-300 rounded-lg w-48 h-6"></div>
                  <div className="bg-gray-300 rounded-lg w-20 h-6"></div>
                </div>
              </div>
              {/* Right side skeleton */}
              <div className="w-50 mt-2 flex items-center justify-center gap-4 text-black">
                <div className="bg-gray-300 rounded-full w-24 h-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[80vh]">
      {orders.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-xl md:text-2xl font-thin text-center">
            Currently, your orders list is empty.
          </h1>
        </div>
      ) : (
        <>
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="flex flex-col lg:flex-row justify-between items-center border-b-2 py-7"
            >
              {/* Left side */}
              <div className="flex justify-center lg:justify-start lg:space-x-4 mb-4 lg:mb-0 space-x-3">
                <Image
                  src={order.lineItems[0]?.productImages[0]}
                  alt="product image"
                  width={100}
                  height={100}
                  className="w-[40%] lg:w-[30%] h-[30%] object-cover rounded mb-2 lg:mb-0"
                />
                <div className="lg:pl-4">
                  {order.delivery_status === "processing" ||
                  order.delivery_status === "on the way" ? (
                    <div className="bg-yellow-500/20 flex items-center justify-center mb-5 rounded-lg">
                      <p className="p-1 text-orange-500 text-sm">
                        {order.delivery_status?.toUpperCase()}
                      </p>
                    </div>
                  ) : order.delivery_status === "delivered" ? (
                    <div className="bg-green-500/20 flex items-center justify-center mb-5 rounded-lg">
                      <p className="p-1 text-green-500 text-sm">
                        {order.delivery_status?.toUpperCase()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/20 flex items-center justify-center mb-5 rounded-lg">
                      <p className="p-1 text-red-500 text-sm">
                        {order.delivery_status?.toUpperCase()}
                      </p>
                    </div>
                  )}

                  <p className="font-semibold">
                    {order.lineItems[0]?.description}
                  </p>
                  <p className="font-semibold">
                    ${new Intl.NumberFormat("en-US").format(order.amount / 100)}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col lg:flex-row lg:items-center md:justify-end lg:space-x-4 w-[80%]">
                <button className="w-50 mt-2 flex items-center justify-center gap-4 text-black border border-black-700 hover:border-black font-semibold text-[.5rem] md:text-sm py-3 px-7 md:px-10 rounded-3xl">
                  <Link href={`/products/all`}> View Details</Link>
                </button>
                <button className="w-50 mt-2 flex items-center justify-center gap-4 text-black border border-black-700 hover:border-black font-semibold text-[.5rem] md:text-sm py-3 px-7 md:px-10 rounded-3xl">
                  <Link href={`/products/all`}> Shop Similar</Link>
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderPage;
