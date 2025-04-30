"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type User = { role: "admin" | "staff" } | null;

export default function Navbar() {
  const [user, setUser] = useState<User>(null);
  const [mounted, setMounted] = useState(false); // ✅ Add this

  useEffect(() => {
    setMounted(true); // ✅ Mark component as mounted
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!mounted) return null; // ✅ Don't render anything on the server

  return (
    <nav className="flex justify-between items-center p-4 bg-[#f5f3f1] shadow fixed top-0 z-10 w-full">
      <Link href="/" className="ml-10">
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </Link>

      <div className="mr-10 flex gap-6 text-sm font-medium text-[#112742] items-center">
        {user ? (
          user.role === "admin" ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/books">Books</Link>
              <Link href="/staffs">Staffs</Link>
              <Link href="/announcement">Announcement</Link>
              <button className="bg-red-600 p-2 rounded-md items-center text-gray-100">Log Out</button>
            </>
          ) : (
            <>
              <Link href="/staff/home">Home</Link>
              <Link href="/staff/orders">Orders</Link>
              <button className="bg-red-600 p-2 rounded-md items-center text-gray-100">Log Out</button>
            </>
          )
        ) : (
          <Link href="/" className="mr-10">Login</Link>
        )}
      </div>
    </nav>
  );
}
