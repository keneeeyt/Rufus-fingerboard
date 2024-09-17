"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
  },
  {
    name: "Products",
    href: "/dashboard/products",
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
  },
  {
    name: "Banner Picture",
    href: "/dashboard/banner",
  },
];

const DashboardNavigation = () => {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              link.href === pathname
                ? "text-black"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
};

export default DashboardNavigation;
