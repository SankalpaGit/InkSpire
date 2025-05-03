import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NotFound = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 }
    );

    gsap.fromTo(
      headingRef.current,
      { scale: 0.6, rotateX: 80, opacity: 0 },
      {
        scale: 1,
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'back.out(1.8)',
        delay: 0.5,
      }
    );

    gsap.fromTo(
      subTextRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.2,
        delay: 0.8,
      }
    );

    gsap.fromTo(
      buttonRef.current,
      { y: 50, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'bounce.out',
        delay: 1.4,
      }
    );
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0e1a2b] px-4 overflow-hidden">
      {/* Background animated bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-500 opacity-10 animate-pulse"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              animationName: 'floatUp',
              filter: 'blur(2px)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div ref={containerRef} className="text-center max-w-xl z-10">
        <h1
          ref={headingRef}
          className="text-[6rem] font-extrabold text-white drop-shadow-lg tracking-wider glow"
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
          className="inline-block mt-10 px-8 py-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all duration-200 ease-in-out"
        >
          Go Home
        </a>
      </div>

      {/* Keyframes for floating */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-100vh) scale(1.2);
          }
        }
        .glow {
          text-shadow: 0 0 10px #6366f1, 0 0 20px #6366f1, 0 0 40px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
