'use client';
import { useRef, useEffect, useState, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to avoid SSR issues
const RingScene = dynamic(() => import('./RingScene'), {
    ssr: false,
    loading: () => <div className="w-full h-full" />
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const mainTitleRef = useRef<HTMLHeadingElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [textReady, setTextReady] = useState(false);

    // Split text into characters for stunning animation
    useEffect(() => {
        if (mainTitleRef.current) {
            const text = mainTitleRef.current.textContent || '';
            const lines = text.split('\n').filter(line => line.trim());

            mainTitleRef.current.innerHTML = lines.map((line, lineIndex) => {
                const chars = line.split('');
                return `<div class="line-wrapper" style="overflow: hidden; display: block;">
                    ${chars.map((char, charIndex) =>
                    `<span class="char" data-line="${lineIndex}" data-char="${charIndex}" style="display: inline-block; transform-origin: 50% 100%;">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('')}
                </div>`;
            }).join('');
        }

        // Mark text as ready after DOM update
        requestAnimationFrame(() => {
            setTextReady(true);
        });
    }, []);

    // Stunning GSAP animations - only run after text is ready
    useGSAP(() => {
        if (!textReady) return;
        const chars = document.querySelectorAll('.char');
        if (chars.length === 0) return;

        const mm = gsap.matchMedia();

        // Only animate on desktop (min-width: 768px)
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                defaults: {
                    ease: 'power4.out'
                }
            });

            // Dramatic character reveal with rotation and scale
            tl.from(chars, {
                yPercent: 120,
                rotationX: -90,
                scale: 0.8,
                opacity: 0,
                transformOrigin: '50% 100%',
                stagger: {
                    each: 0.02,
                    from: 'start',
                },
                duration: 1.2,
                ease: 'back.out(1.5)',
            });

            // Floating animation for title
            gsap.to(chars, {
                y: -5,
                duration: 2,
                stagger: {
                    each: 0.05,
                    repeat: -1,
                    yoyo: true,
                },
                ease: 'sine.inOut',
            });

            // Parallax scroll effect
            gsap.to(imageContainerRef.current, {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            gsap.to(mainTitleRef.current, {
                yPercent: -30,
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        });

        // Infinite Marquee Animation - run on all devices
        mm.add("(min-width: 0px)", () => {
            if (marqueeRef.current) {
                const parts = marqueeRef.current.children;
                if (parts.length === 2) {
                    const part1 = parts[0];
                    const part2 = parts[1];
                    const duration = 30; // Time to move one full width

                    // Part 1: Moves from 0 to -100%, then jumps to 100% and loops 100% -> -100%
                    gsap.to(part1, {
                        xPercent: -100,
                        duration: duration,
                        ease: 'none',
                        onComplete: () => {
                            gsap.fromTo(part1,
                                { xPercent: 100 },
                                { xPercent: -100, duration: duration * 2, repeat: -1, ease: 'none' }
                            );
                        }
                    });

                    // Part 2: Moves from 0 to -200% (visual 100% -> -100%), then resets to 0 (visual 100%)
                    gsap.to(part2, {
                        xPercent: -200,
                        duration: duration * 2,
                        ease: 'none',
                        repeat: -1
                    });
                }
            }
        });

        // Cleanup
        return () => mm.revert();

    }, { scope: heroRef, dependencies: [textReady] });

    // Magnetic effect on hover
    const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(e.currentTarget, {
            x: x * 0.05,
            y: y * 0.05,
            rotationY: x * 0.02,
            rotationX: -y * 0.02,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    const handleImageLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
        });
    };

    return (
        <>
            <section
                ref={heroRef}
                className="relative min-h-[0vh] flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-20 md:py-32 overflow-hidden"
            >
                {/* Subtle grid background */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px',
                    }}
                />

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh]">

                    {/* Text Content - In Background */}
                    <div className="relative z-0 text-center">
                        {/* Main Title - Stunning Typography */}
                        <h1
                            ref={mainTitleRef}
                            className="text-[11vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] font-bold text-black/85 mb-6 md:mb-8 leading-[0.85] tracking-tighter"
                            style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {'Think Different\nCreate Better'}
                        </h1>


                    </div>

                    {/* 3D Ring Model - Floating Above Text */}
                    <div
                        ref={imageContainerRef}
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        style={{
                            perspective: '1000px',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <div className="w-full h-[50vh] md:h-full max-w-screen pointer-events-auto">
                            <RingScene key="ring-scene-singleton" />
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 md:mt-16">
                        {['Available for Work', 'Based in India', 'Open Source'].map((text, i) => (
                            <div
                                key={i}
                                className="px-4 md:px-6 py-2 md:py-3 rounded-full border border-black/10 dark:border-white/20 text-xs md:text-base text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/40 hover:text-black dark:hover:text-white transition-all duration-300 cursor-pointer backdrop-blur-sm"
                                style={{
                                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-xs uppercase tracking-[0.3em] text-black dark:text-white font-light">
                            Scroll
                        </span>
                        <div className="w-px h-12 bg-linear-to-b from-black/50 to-transparent dark:from-white/50 animate-pulse" />
                    </div>
                </div>

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                `}</style>

                {/* Bottom Art & Text */}
                <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none mix-blend-difference text-black dark:text-white">
                    {/* Corner Details */}
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 flex flex-col gap-1 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] opacity-60">Role</p>
                        <p className="text-base md:text-lg font-light tracking-wide">Creative Developer</p>
                    </div>

                    <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12 flex flex-col gap-1 text-right">
                        <p className="text-xs uppercase tracking-[0.2em] opacity-60">Year</p>
                        <p className="text-base md:text-lg font-light tracking-wide">2026</p>
                    </div>

                    {/* Artistic Marquee */}
                    <div className="w-full overflow-hidden opacity-[0.03] dark:opacity-[0.05] pb-2">
                        <div ref={marqueeRef} className="whitespace-nowrap flex">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex shrink-0">
                                    {['Design', 'Development', 'Experience', 'Interaction'].map((item, index) => (
                                        <span key={index} className="text-[15vw] md:text-[12vh] leading-none font-bold uppercase letter-spacing-[0.2em] tracking-tighter mr-8">
                                            {item} •
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
