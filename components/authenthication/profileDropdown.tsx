import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const { isAuthenticated, handleLogOut, user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Handle log out
    const handleLogOutClick = () => {
        handleLogOut();
        router.push("/login");
        setIsOpen(false);
    };

    const handleItemClick = () => {
        setIsOpen(false);
    };

    if (!isAuthenticated || !user) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="hover:bg-accent px-2 py-1 rounded-md flex items-center gap-1">
                {user.name} <ChevronDown className={`size-5 transition-transform ${isOpen ? 'rotate-90' : ""}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleItemClick}>
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
