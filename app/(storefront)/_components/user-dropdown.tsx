import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

interface UserDropdownProps {
  email: string;
  name: string;
  userImage: string | undefined;
}

function UserDropdown({ email, name, userImage }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={userImage} alt={name} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/orders">
            <span>My Orders</span>
          </Link>
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink className="flex items-center">
            {" "}
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </LogoutLink>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
