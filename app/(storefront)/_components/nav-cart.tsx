'use client'
import { useCart } from "@/app/_context/CartContext";
import axios from "axios";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function NavCart({user}: any) {
  const {cart, refreshCart} = useCart();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    if (shouldRefresh) {
      refreshCart();
      setShouldRefresh(false); // Reset after refreshing
    }
  }, [shouldRefresh, refreshCart]);

  const total = Array.isArray(cart)
  ? cart.reduce((acc: number, item: any) => acc + item.quantity, 0)
  : 0;

  return (
    <>
      <Link href={"/bag"} className="group p-2 flex items-center mr-2">
        <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
         {total}
        </span>
      </Link>
    </>
  );
}

export default NavCart;
