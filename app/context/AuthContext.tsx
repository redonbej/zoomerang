"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/interceptor";
import { AuthContextType, AuthProviderProps, User } from "@/lib/interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    window['user'] = JSON.parse(localStorage.getItem("user") || '{}');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUserData = async () => {
                try {
                    const { data } = await axiosInstance.get("/user");
                    setUser(data);
                    window['user'] = data;
                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                }
            };

            fetchUserData();
        } else {
            setIsAuthenticated(false);
            delete window['user'];
            localStorage.removeItem('user')
        }
    }, []);

    // Handle log out
    const handleLogOut = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
        delete window['user'];
        localStorage.removeItem('user')
    };

    // Set user data after login
    const logIn = (userData: User) => {
        window['user'] = userData;
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData))
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, handleLogOut, logIn }}>
            {children}
        </AuthContext.Provider>
    );
};
