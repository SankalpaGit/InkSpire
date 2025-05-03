import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaBookOpen } from 'react-icons/fa';

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [showTransition, setShowTransition] = useState(true);
  const overlayRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    setShowTransition(true);

    const animate = () => {
      if (!overlayRef.current || !iconRef.current || !textRef.current) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => setShowTransition(false),
      });

      tl.fromTo(
        overlayRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.6 }
      )
        .fromTo(
          iconRef.current,
          { opacity: 0, rotate: -90, scale: 0.5 },
          { opacity: 1, rotate: 0, scale: 1, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .to([iconRef.current, textRef.current], {
          opacity: 0,
          y: -40,
          duration: 0.5,
          delay: 0.4,
        })
        .to(overlayRef.current, {
          y: '-100%',
          duration: 0.6,
        });
    };

    // Wait for DOM to mount
    requestAnimationFrame(() => {
      setTimeout(animate, 0);
    });
  }, [location.pathname]);

  return (
    <>
      {showTransition && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] bg-[#0e1a2b] flex items-center justify-center overflow-hidden"
        >
          {/* Floating bubbles */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {[...Array(25)].map((_, i) => (
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

          {/* Logo and Text */}
          <div className="relative z-10 ">
            <div ref={iconRef} className="text-white  text-[155px] items-center justify-center mb-3 drop-shadow-2xl">
              <FaBookOpen />
            </div>
            <h1
              ref={textRef}
              className="text-3xl md:text-5xl text-center font-extrabold tracking-wide text-white glow"
              style={{ fontFamily: `'Poppins', sans-serif` }}
            >
              InkSpire
            </h1>
          </div>

          {/* Floating animation keyframes */}
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
      )}

      {/* Content shown after animation */}
      <div className={`${showTransition ? 'pointer-events-none opacity-0' : 'opacity-100 transition-opacity duration-200'}`}>
        {children}
      </div>
    </>
  );
};

export default RouteTransition;
