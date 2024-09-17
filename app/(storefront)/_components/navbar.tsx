import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavbarLinks from "./navbar-links";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import UserDropdown from "./user-dropdown";
import { Button } from "@/components/ui/button";
import NavCart from "./nav-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="md:flex items-center hidden">
        <Link href={"/"}>
          <Image src="/rufus.png" alt="Logo" width={150} height={150} />
        </Link>
        <NavbarLinks />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className="shrink-0 md:hidden"
            size={"icon"}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <nav className="grid gap-6 text-lg font-medium mt-5">
            <NavbarLinks />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center">
        {user ? (
          <>
            <NavCart />

            <UserDropdown
              email={user.email as string}
              name={user.given_name as string}
              userImage={
                user.picture ??
                `https://avatar.vercel.sh/rauchg/${user.given_name}`
              }
            />
          </>
        ) : (
          <div className="flex md:flex-1 md:items-center md:justify-end md:space-x-2">
            <Button variant={"ghost"} asChild>
              <LoginLink>Sign in</LoginLink>
            </Button>
            <span className="h-6 w-px bg-gray-200"></span>
            <Button variant={"ghost"} asChild>
              <RegisterLink>Create Account</RegisterLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
