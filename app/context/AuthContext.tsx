"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { AuthContextType, AuthProviderProps, User } from "@/lib/interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUserData = async () => {
                const res = await fetch("/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            };

            fetchUserData();
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Handle log out
    const handleLogOut = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
    };

    // Set user data after login
    const logIn = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, handleLogOut, logIn }}>
            {children}
        </AuthContext.Provider>
    );
};
