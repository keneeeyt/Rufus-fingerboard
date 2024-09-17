"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {

  const [activeImage, setActiveImage] = useState(0);

  const prevImage = () => {
    setActiveImage((prev) => prev === 0 ? images?.length - 1 : prev - 1);
  };

  const nextImage = () => {
    setActiveImage((prev) => prev === images?.length - 1 ? 0 : prev + 1);
  }

  const handleImageClick = (index: number) => {
    setActiveImage(index);
  }

  return (
    <div className="grid gap-6 md:gap-3 items-start">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          quality={100}
          width={600}
          height={600}
          src={images && images[activeImage]}
          alt="Product image"
          className="object-cover w-[600px] h-[600px]"
        />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={prevImage}  variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={nextImage} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {
          images && images.map((image, index) =>  (
            <div key={index} className={cn( index === activeImage ? "border-2 border-primary" :"border border-gray-200" ,"relative overflow-hidden rounded-lg cursor-pointer")} onClick={()=> handleImageClick(index)}>
              <Image
                quality={100}
                width={100}
                height={100}
                src={image}
                alt="Product image"
                className="object-cover w-[100px] h-[100px]"
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ImageSlider;
