"use client";

import { useRouter } from 'next/navigation';
import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextType, AuthProviderProps } from "@/lib/interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    // Check if the user is authenticated on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Handle log out
    const handleLogOut = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push("/login");
    };

    const logIn = () => {
        setIsAuthenticated(true);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogOut, logIn }}>
            {children}
        </AuthContext.Provider>
    );
};