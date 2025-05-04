import React, { useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
import { gsap } from 'gsap';
import axios from 'axios';

const icons = [<FaLock />, <FaKey />, <FaShieldAlt />];

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // Success message state
  const formRef = useRef(null);
  const bgRefs = useRef([]);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    bgRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          y: '-100vh',
          repeat: -1,
          ease: 'none',
          duration: 20 + Math.random() * 10,
          delay: Math.random() * 5,
        });
      }
    });
  }, []);

  const generateRandomPosition = () => {
    let top, left;
    do {
      top = Math.random() * 100;
      left = Math.random() * 100;
    } while (top > 35 && top < 65 && left > 35 && left < 65);  // Avoid center 30%
    return { top: `${top}%`, left: `${left}%` };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5106/api/AdminAuth/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      setSuccess('Welcome boss 🫡');  // Set success message
      setTimeout(() => {
        window.location.href = '/admin/dashboard';  // Redirect after 2 seconds
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0e1a2b] overflow-hidden px-4">
      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const { top, left } = generateRandomPosition();
          const Icon = icons[i % icons.length];
          const size = Math.random() * 30 + 30;

          return (
            <div
              key={i}
              ref={(el) => (bgRefs.current[i] = el)}
              className="absolute text-indigo-400 opacity-10"
              style={{
                top,
                left,
                fontSize: `${size}px`,
                filter: 'blur(2px) saturate(80%)',
                transform: `scale(${0.8 + Math.random() * 0.6})`,
              }}
            >
              {Icon}
            </div>
          );
        })}
      </div>

      {/* Login Card */}
      <div
        ref={formRef}
        className="relative z-10 backdrop-blur-lg bg-white/5 border border-indigo-500/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400 tracking-wide glow">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Gmail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="admin@example.com"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 placeholder-gray-400"
              placeholder="••••••••"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute top-9 right-3 cursor-pointer text-gray-400 hover:text-indigo-400 transition"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Display error or success message */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm font-semibold">{success}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold tracking-wide"
          >
            Login
          </button>
        </form>
      </div>

      {/* Keyframes for floating */}
      <style>{`
        .glow {
          text-shadow: 0 0 10px #6366f1, 0 0 20px #6366f1, 0 0 40px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default AdminAuth;
