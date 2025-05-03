import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-gray-200 text-gray-700 pt-12 pb-6 px-6 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10 text-center md:text-left">
        {/* Brand Info */}
        <div className="md:max-w-xs">
          <h3 className="text-2xl font-bold text-[#112742] mb-3">InkSpire</h3>
          <p className="text-sm leading-relaxed">
            Discover stories that ignite imagination. Your next favorite book is just a click away.
          </p>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-lg font-semibold text-[#112742] mb-2">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600">Profile</a></li>
            <li><a href="#" className="hover:text-indigo-600">Order History</a></li>
            <li><a href="#" className="hover:text-indigo-600">Wishlist</a></li>
            <li><a href="#" className="hover:text-indigo-600">Carts</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold text-[#112742] mb-2">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-600">Terms & cindition</a></li>
            <li><a href="#" className="hover:text-indigo-600">Privacy Poilicy</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm">
        © 2025 <span className="font-semibold">InkSpire</span>. All rights reserved.
      </div>
    </footer>
  );
};
