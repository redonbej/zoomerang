"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    setIsLowerCase(/[a-z]/.test(value));
    setIsUpperCase(/[A-Z]/.test(value));
    setIsNumber(/\d/.test(value));
    setIsLengthValid(value.length >= 8);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    // Basic validation for the app
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        window.location.href = '/login';
      } else {
        setErrorMessage(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-2 border rounded-md"
              required
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
            <div id="message">
              <h3>Password must contain the following:</h3>
              <p id="letter" className={isLowerCase ? "text-green-500" : "text-red-500"}>
                A <b>lowercase</b> letter
              </p>
              <p id="capital" className={isUpperCase ? "text-green-500" : "text-red-500"}>
                A <b>capital (uppercase)</b> letter
              </p>
              <p id="number" className={isNumber ? "text-green-500" : "text-red-500"}>
                A <b>number</b>
              </p>
              <p id="length" className={isLengthValid ? "text-green-500" : "text-red-500"}>
                Minimum <b>8 characters</b>
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
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
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading || !(isLowerCase && isUpperCase && isNumber && isLengthValid)}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
}