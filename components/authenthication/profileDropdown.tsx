import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const { handleLogOut } = useAuth();  
    const router = useRouter();

    // Handle log out
    const handleLogOutClick = () => {
        handleLogOut(); 
        router.push("/login"); 
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>My name</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href="/profile" className="text-base flex items-center gap-2">
                        <UserIcon className="size-5" /> My profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOutClick} className="cursor-pointer text-base flex items-center gap-2">
                    <LogOutIcon className="!size-5" /> Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
