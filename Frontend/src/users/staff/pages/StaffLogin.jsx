import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPass, setShowPass] = useState(false);
  const formRef = useRef(null);
  const bgRefs = useRef([]);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateRandomPosition = () => {
    let top, left;
    do {
      top = Math.random() * 100;
      left = Math.random() * 100;
    } while (top > 35 && top < 65 && left > 35 && left < 65);  // Avoid center 30%
    return { top: `${top}%`, left: `${left}%` };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    axios
      .post('http://localhost:5106/api/StaffAuth/login', {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        setSuccessMessage('Welcome, Staff Member!');
        setTimeout(() => {
          navigate('/staff/home');
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage('Invalid email or password.');
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fcfcfc] overflow-hidden px-4">
      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const { top, left } = generateRandomPosition();
          const size = Math.random() * 30 + 30;

          return (
            <div
              key={i}
              ref={(el) => (bgRefs.current[i] = el)}
              className="absolute text-indigo-400 opacity-30"
              style={{
                top,
                left,
                fontSize: `${size}px`,
                filter: 'blur(2px) saturate(80%)',
                transform: `scale(${0.8 + Math.random() * 0.6})`,
              }}
            >
              <FaEyeSlash />
            </div>
          );
        })}
      </div>

      {/* Login Card */}
      <div
        ref={formRef}
        className="relative z-10 backdrop-blur-lg bg-white/5 border border-indigo-500/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm "
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400  ">
          Staff Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="youremail@example.com"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
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
          {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-400 text-sm font-semibold">{successMessage}</p>
          )}

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

export default StaffLogin;
