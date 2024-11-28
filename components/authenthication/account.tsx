import { useEffect, useState } from "react";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Account() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Check if the user is authenticated on component mount
    useEffect(() => {
        // Check if the JWT token exists in localStorage (or cookies, etc.)
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Handle log out
    const handleLogOut = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Update the authentication state
        setIsAuthenticated(false);

        router.push("/login");
    };

    return (
        <>
            {isAuthenticated ? (
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleLogOut}>
                    <Link href="/account" className="text-base flex items-center gap-2" >
                        <LogOutIcon className="!size-5" /> Sign Out
                    </Link>
                </Button>
            ) : (
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/login" className="text-base flex items-center gap-2">
                        <LogInIcon className="!size-5" /> Sign In
                    </Link>
                </Button>
            )
            }
        </>
    )
}
