"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
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
    <div className="max-w-screen-2xl m-auto flex justify-between items-center py-2 px-8">
      <div className="bg-gray-50 shadow mt-12 w-full p-8 rounded-lg">
        <h2 className="flex gap-1 font-medium items-center justify-center text-gray-800 text-2xl mb-16 text-center">
          <User className="size-6"/> User information
          </h2>
        <p className="flex text-gray-800 text-lg items-center gap-2"> My Profile</p>
        <p className="flex text-gray-700 font-medium mt-4 items-center gap-2">Name: {user?.name}</p>
        <p className="flex text-gray-700 font-medium items-center gap-2">Email: {user?.email}</p>
      </div>
    </div>
  );
}
