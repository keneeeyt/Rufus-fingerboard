import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductProps {
  item: any;
}

function ProductCard({ item }: ProductProps) {
  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {item.product_images.map((image: any, index: number) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  key={index}
                  src={image}
                  alt={"product image"}
                  fill
                  className="object-cover object-center h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center center mt-2">
        <h1 className="font-semibold text-xl">{item.product_name}</h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 font-medium text-primary ring-1 ring-inset ring-primary/10">
          ${item.product_price}
        </h3>
      </div>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.product_description}</p>
      <Button asChild className="w-full mt-5">
        <Link href={`/product/${item._id}`}>Learn More</Link>
      </Button>
    </div>
  );
}

export default ProductCard;
