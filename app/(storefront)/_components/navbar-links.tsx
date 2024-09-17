"use client";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type NavbarLinks = {
  category_title: string;
  category_name: string;
  _id: string;
};
function NavbarLinks() {
  const [links, setLinks] = useState<NavbarLinks[]>([
    {
      category_title: "Home",
      category_name: "/",
      _id: "1",
    },
    {
      category_title: "All Products",
      category_name: "all",
      _id: "2",
    },
  ]);

  const location = usePathname();

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get("/api/category");

        // Filter out duplicates based on the _id field
        const newLinks = resp.data.filter(
          (newLink: NavbarLinks) => !links.some((link) => link._id === newLink._id)
        );

        // Only update the state if there are new, non-duplicate links
        if (newLinks.length > 0) {
          setLinks((prevLinks) => [...prevLinks, ...newLinks]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [links]);

  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {links.map((link) => {
        const isActive =
          link.category_name === "/"
            ? location === "/"
            : location === `/products/${link.category_name}`;

        return (
          <Link
            key={link._id}
            href={link.category_name === "/" ? "/" : `/products/${link.category_name}`}
            className={cn(isActive ? 'bg-muted' : 'hover:bg-muted hover:bg-opacity-75', 'group p-2 font-medium rounded-md')}
          >
            {link.category_title}
          </Link>
        );
      })}
    </div>
  );
}

export default NavbarLinks;
