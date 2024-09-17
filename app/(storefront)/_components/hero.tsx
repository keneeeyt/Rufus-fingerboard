"use client";
import ErrorPage from "@/app/error-page";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function Hero() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get("/api/banner");
        setBanners(resp.data);
      } catch (err) {
        console.log(err);
        setError(true)
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if(isError){
    return <ErrorPage />
  }

  return (
    <Carousel>
      <CarouselContent>
        {loading ? (
          // Loading skeleton for carousel
          [...Array(3)].map((_, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] lg:h-[80vh] animate-pulse bg-gray-200 rounded-xl">
                <div className="absolute top-6 left-10 bg-gray-300 h-12 lg:h-16 w-3/4 rounded-lg"></div>
                <div className="absolute bottom-6 right-10 bg-gray-300 h-16 w-16 rounded-full"></div>
              </div>
            </CarouselItem>
          ))
        ) : (
          banners.length > 0 &&
          banners.map((banner: any) => (
            <CarouselItem key={banner._id}>
              <div className="relative h-[60vh] lg:h-[80vh]">
                <Image
                  alt="Banner Image"
                  src={banner.banner_image}
                  fill
                  className="object-cover w-full h-full rounded-xl"
                />
                <div className="absolute top-6 left-10 bg-opacity-75 bg-black text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
                  <h1 className="text-xl lg:text-4xl font-bold">
                    {banner.banner_name}
                  </h1>
                </div>
                <div className="absolute bottom-6 right-10">
                  <Image alt="Logo" src="/rufuslogo.png" width={200} height={200} />
                </div>
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className="ml-16" />
      <CarouselNext className="mr-16" />
    </Carousel>
  );
}

export default Hero;
