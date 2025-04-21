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
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </Link>

      <div className="flex gap-6 text-sm font-medium">
        {user ? (
          user.role === "admin" ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/books">Books</Link>
              <Link href="/staffs">Staffs</Link>
              <Link href="/announcement">Announcement</Link>
            </>
          ) : (
            <>
              <Link href="/home">Home</Link>
              <Link href="/orders">Orders</Link>
            </>
          )
        ) : (
          <Link href="/">Login</Link>
        )}
      </div>
    </nav>
  );
}
