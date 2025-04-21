"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const router = useRouter();

  const handleLogin = () => {
    // mock login
    if (gmail && password) {
      localStorage.setItem("user", JSON.stringify({ role }));
      if (role === "admin") router.push("/dashboard");
      else router.push("/home");
    } else {
      alert("Enter Gmail & Password");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <input
        type="email"
        value={gmail}
        onChange={(e) => setGmail(e.target.value)}
        placeholder="Gmail"
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Login
      </button>
    </div>
  );
}
