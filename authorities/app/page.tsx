"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const router = useRouter();

  const handleLogin = () => {
    if (gmail && password) {
      localStorage.setItem("user", JSON.stringify({ role }));
      if (role === "admin") router.push("/dashboard");
      else router.push("/home");
    } else {
      alert("Enter Gmail & Password");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Left side image */}
      <div className="relative w-full md:w-5/12 h-64 md:h-full">
        <Image
          src="/image.png"
          alt="Login Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Vertical line divider */}
      <div className="hidden md:flex items-center justify-center relative">
        <div className="w-px h-1/2 bg-gradient-to-b from-transparent via-[#112742] to-transparent animate-pulse" />
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center w-full md:w-7/12 p-8 h-full">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold text-[#112742]">Welcome Back</h1>
          <p className="text-gray-600">Login to access your dashboard</p>

          <div className="space-y-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112742]"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              placeholder="Gmail"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112742]"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112742]"
            />

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-[#112742] text-white font-semibold rounded-lg transform transition duration-300 hover:bg-[#0d1c33] hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
