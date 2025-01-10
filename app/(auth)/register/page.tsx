"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!showValidation) setShowValidation(true);
  };

  const isLowercase = /[a-z]/.test(password);
  const isUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMinLength = password.length >= 8;

  const isPasswordValid =
    isLowercase && isUppercase && hasNumber && isMinLength && password === confirmPassword;

  const isEmailValid = emailRegex.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!isEmailValid) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Password does not meet the requirements.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        window.location.href = "/login";
      } else {
        setErrorMessage(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Server error. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-16 items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            {!isEmailValid && email && (
              <p className="text-red-500 text-sm">Please enter a valid email address.</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          {showValidation && (
            <div id="message" className="mb-4 text-sm font-medium">
              <h3>Password must contain the following:</h3>
              <p className={isLowercase ? "text-green-500" : "text-red-500"}>
                A <b>lowercase</b> letter
              </p>
              <p className={isUppercase ? "text-green-500" : "text-red-500"}>
                A <b>capital (uppercase)</b> letter
              </p>
              <p className={hasNumber ? "text-green-500" : "text-red-500"}>
                A <b>number</b>
              </p>
              <p className={isMinLength ? "text-green-500" : "text-red-500"}>
                Minimum <b>8 characters</b>
              </p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-white rounded-md hover:bg-blue-700"
            disabled={loading || !isPasswordValid || !isEmailValid}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}