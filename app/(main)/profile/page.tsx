"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation"; 

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div>
      <h1>My Profile</h1>
    </div>
  );
}
