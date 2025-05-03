import React, { useEffect, useRef } from 'react';
import { FaBookOpen, FaUserCircle, FaBookmark, FaShoppingCart } from 'react-icons/fa';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50"
    >
      <div className="flex items-center gap-8 text-[#112742] font-bold text-xl">
        <Link to="/">
          <div className="flex items-center gap-2">
            <FaBookOpen />
            <span>InkSpire</span>
          </div>
        </Link>
        <Link to="/catalog">
          <div className="flex gap-4 text-base font-medium text-[#112742]">
            <button className="hover:text-[#112742] transition">Catalogs</button>
          </div>
        </Link>
      </div>

      <div className="flex gap-11 items-center text-2xl text-gray-600 ">
        <Link to="/bookmarks">
          <FaBookmark className="cursor-pointer hover:text-[#112742] " />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="cursor-pointer hover:text-[#112742]" />
        </Link>
        <Link to="/profile">
          <FaUserCircle className="cursor-pointer hover:text-[#112742]" />
        </Link>
      </div>
    </nav>
  );
};
