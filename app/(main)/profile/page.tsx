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
    <div className="max-w-screen-lg mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-600" />
          </div>

          <h2 className="text-gray-800 text-2xl font-semibold mb-2">
            {user?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm mb-8">{user?.email || "Email not available"}</p>

          <div className="w-full space-y-2">
            <div className="flex items-center">
              <span className="font-medium text-gray-600 uppercase tracking-wide mr-2">
                Full Name:
              </span>
              <span className="text-gray-800 font-medium text-base">
                {user?.name || "Not Provided"}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <span className="font-medium text-gray-600 uppercase tracking-wide mr-2">
                Email:
              </span>
              <span className="text-gray-800 font-medium text-base">
                {user?.email || "Not Provided"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
