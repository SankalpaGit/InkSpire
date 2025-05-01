import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NotFound = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Container fade-in and lift
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 }
    );

    // "404" heading animation
    gsap.fromTo(
      headingRef.current,
      { scale: 0.6, skewX: -15, opacity: 0 },
      {
        scale: 1,
        skewX: 0,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        delay: 0.5,
      }
    );

    // Subtext lines stagger in
    gsap.fromTo(
      subTextRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.15,
        delay: 0.8,
      }
    );

    // Button bounce in
    gsap.fromTo(
      buttonRef.current,
      { y: 50, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'bounce.out',
        delay: 1.3,
      }
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#112742] px-4 overflow-hidden">
      <div ref={containerRef} className="text-center max-w-lg">
        <h1
          ref={headingRef}
          className="text-7xl font-extrabold text-white mb-4"
        >
          404
        </h1>

        <p
          ref={(el) => (subTextRef.current[0] = el)}
          className="text-2xl text-gray-300"
        >
          Page Not Found
        </p>
        <p
          ref={(el) => (subTextRef.current[1] = el)}
          className="text-lg text-gray-400 mt-1"
        >
          We couldn’t find the page you were looking for.
        </p>

        <a
          ref={buttonRef}
          href="/"
          className="inline-block mt-8 px-8 py-3 bg-indigo-700 text-white rounded-full shadow-xl hover:bg-indigo-800 hover:scale-105 transition-all duration-200 ease-in-out"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
