"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);

        logIn({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });

        router.push("/profile");
      } else {
        setErrorMessage(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(
        error.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-sm text-blue-600 hover:underline">
            Sign Up?
          </Link>
        </div>
      </div>
    </div>
  );
}
