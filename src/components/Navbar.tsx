"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { theme } from "./theme";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className={`" sticky top-0 z-20 " ${theme.bgColor}`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            GossipMe
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {session?.user ? (
            <Button
            onClick={()=> signOut()}
              className="text-black bg-white font-medium rounded-lg text-sm px-4 py-2 text-center"
              variant="outline"
            >
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button
                className="text-black bg-white font-medium rounded-lg text-sm px-4 py-2 text-center"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
          
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
