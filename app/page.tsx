"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white flex flex-col">
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="text-center max-w-lg">
          <h2 className="text-4xl font-semibold mb-4">Welcome to Zoomerang</h2>
          <p className="text-lg mb-6">
            Connect, chat, and collaborate with ease. Start your video calls
            with just a click.
          </p>

          <Link href="/room" legacyBehavior passHref>
            <Button
              color="blue"
              className="px-8 py-4 text-lg font-semibold hover:bg-blue-600"
            >
              Start a Video Call
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
