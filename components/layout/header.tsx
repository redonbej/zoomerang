"use client";

import Account from "../authenthication/account";
import Link from "next/link";
import { NavigationMenu } from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <div className="w-full sticky top-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 shadow">
      <div className="max-w-screen-2xl m-auto flex justify-between items-center py-2 px-8">
        <Link href="/" legacyBehavior passHref>
          <span className="cursor-pointer text-white">Zoomerang</span>
        </Link>
        <NavigationMenu>
          <Account />
        </NavigationMenu>
      </div>
    </div>
  );
}
