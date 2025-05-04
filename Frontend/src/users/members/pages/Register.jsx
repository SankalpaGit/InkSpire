import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import gsap from 'gsap';

const Register = () => {
    const navigate = useNavigate();
    const formRef = useRef();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        showPassword: false,
        agree: false,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        gsap.from(formRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            setMessage("You must agree to the terms.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post("http://localhost:5106/api/MemberAuth/register", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            });

            setMessage(res.data.message || "Registration successful!");

            setTimeout(() => {
                setLoading(false);
                navigate("/login");
            }, 2500);
        } catch (err) {
            setLoading(false);
            const errMsg = err.response?.data?.message || "Something went wrong.";
            setMessage(errMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full md:w-1/2 hidden md:block">
                <img
                    src="/static/image1.png"
                    alt="Register at InkSpire"
                    className="h-screen w-full object-cover"
                />
            </div>

            <div ref={formRef} className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 border border-[#112742] glow">
                <h2 className="text-3xl font-bold text-center text-indigo-600">Register at InkSpire</h2>

                {message && (
                    <div
                        className={`text-center text-sm p-2 rounded 
                            ${messageType === "success"
                                ? "text-green-700 bg-green-100"
                                : "text-red-600 bg-red-100"
                            }`}
                    >
                        {message}
                    </div>
                )}


                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

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

                    <div className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            name="agree"
                            className="mr-2 scale-150 accent-indigo-600"
                            checked={formData.agree}
                            onChange={handleChange}
                        />
                        <span className="text-gray-600 font-bold">
                            I agree to the{" "}
                            <a href="#" className="text-indigo-600 underline">
                                Terms & Conditions
                            </a>
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white rounded-lg transition-all duration-500 ${loading
                            ? "bg-gradient-to-r from-[#112742b6] via-[#112742e2] to-[#112742] animate-pulse"
                            : "bg-[#112742e9] hover:bg-[#112742]"
                            }`}
                    >
                        {loading ? "Registering..." : "Register"}
                        {!loading && <FaUserPlus />}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#112742] font-medium hover:underline">
                        Login
                    </a>
                </p>
            </div>

        </div>
    );
};

export default Register;
