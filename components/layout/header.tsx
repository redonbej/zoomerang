"use client"

import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LogInIcon } from "lucide-react"

export function Header() {
    return (
        <div className="w-full sticky top-0 bg-white shadow">
            <div className="max-w-screen-2xl m-auto flex justify-between items-center py-2 px-8">
                <Link href="/" legacyBehavior passHref>
                    Zoomerang
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/login" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/register" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Contact
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/register" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} border text-white bg-blue-500 hover:bg-blue-600 hover:text-white gap-2`}>
                                    <LogInIcon /> Sign up
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}
