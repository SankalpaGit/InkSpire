import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("http://localhost:5106/api/MemberAuth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Login successful! Redirecting...");
      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid credentials or something went wrong.";
      setMessage(errMsg);
      setStatus("error");
    }
  };

  const getButtonClasses = () => {
    switch (status) {
      case "loading":
        return "bg-gray-500 animate-pulse";
      case "success":
        return "bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse";
      case "error":
        return "bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-pulse";
      default:
        return "bg-[#112742e9] hover:bg-[#112742]";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full md:w-1/2 max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 border-[#112742] glow">
        <h2 className="text-3xl font-bold text-center text-indigo-600">Login to InkSpire</h2>

        {message && (
          <div className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {message}
          </div>
        )}

        {successMessage && (
          <div className="text-center text-sm text-green-600 bg-green-100 p-2 rounded">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <div
              className="absolute top-10 right-3 text-gray-600 cursor-pointer"
              onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            >
              {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white rounded-lg transition-all duration-500 ${getButtonClasses()}`}
          >
            {status === "loading" ? "Logging in..." : "Login"}
            {status !== "loading" && <FaUser />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-[#112742] font-medium hover:underline">
            Register
          </a>
        </p>
      </div>

      <div className="hidden md:block w-1/2">
        <img
          src="/static/image1.png"
          alt="Login to InkSpire"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
