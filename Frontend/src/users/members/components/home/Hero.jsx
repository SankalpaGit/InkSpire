import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(TextPlugin);

export const Hero = () => {
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const browseBtnRef = useRef(null);
    const getStartedBtnRef = useRef(null);
    const bgRef = useRef(null);
    const floatingShapesRef = useRef([]);

    const navigate = useNavigate();

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
            headingRef.current,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 0.4 }
        )
            .fromTo(
                subheadingRef.current,
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 1.2 },
                '-=1'
            )
            .fromTo(
                [browseBtnRef.current, getStartedBtnRef.current],
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.75)',
                    stagger: 0.2,
                },
                '-=0.8'
            )
            .fromTo(
                bgRef.current,
                { opacity: 0, scale: 1.1 },
                { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
            );

        gsap.to(subheadingRef.current, {
            duration: 4,
            text: "Explore our curated collection of hidden gems.",
            ease: 'none',
        });

        gsap.to(floatingShapesRef.current, {
            y: '+=30',
            repeat: -1,
            yoyo: true,
            duration: 6,
            ease: 'sine.inOut',
            stagger: 0.8
        });
    }, []);

    return (
        <section
            ref={bgRef}
            className="relative px-6 h-[80vh] flex items-center justify-center bg-gray-100"
        >
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto w-full">
                {/* Left Side */}
                <div className='w-11/12 px-16 '>
                    <h1
                        ref={headingRef}
                        className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-[#112742] text-transparent bg-clip-text"
                    >
                        Discover Your Next Great Read
                    </h1>
                    <p ref={subheadingRef} className="mt-4 text-lg text-gray-700">
                        Loading description...
                    </p>

                    <div className='flex flex-col-2 gap-4'>
                        <button
                            ref={browseBtnRef}
                            onClick={() => navigate('/catalog')}
                            className="mt-6 px-6 py-3 bg-[#112742] rounded-md text-white hover:bg-indigo-700 transition"
                        >
                            Browse Books
                        </button>
                        <button
                            ref={getStartedBtnRef}
                            onClick={() => navigate('/login')}
                            className="mt-6 px-6 py-3 bg-gray-100 border border-[#112742] font-semibold text-gray-700 rounded-md transition"
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Right Side: Video + Floating Stats */}
                <div className="relative w-full">
                    <video
                        className="w-full h-auto"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="https://videocdn.cdnpk.net/videos/8cd1ac03-9988-5295-99ba-916df092bc70/horizontal/previews/clear/large.mp4?token=exp=1746321156~hmac=ab733068cb594f66814e63cbd863ed8ab72df872e7437aa120a0421dbd8b73f3" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Stats */}
                    <div className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-6 py-4 rounded-xl flex gap-8 text-center text-indigo-700 font-semibold  max-w-md">
                        <div>
                            <p className="text-2xl">25K+</p>
                            <p className="text-sm text-gray-600">Active Readers</p>
                        </div>
                        <div>
                            <p className="text-2xl">10K+</p>
                            <p className="text-sm text-gray-600">Books Available</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
