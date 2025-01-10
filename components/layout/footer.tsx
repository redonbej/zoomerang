import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-center text-white p-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} Zoomerang. All rights reserved.</p>
    </footer>
  );
}
