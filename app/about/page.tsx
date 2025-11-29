'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/header/header';
import { ArrowUpRight } from 'lucide-react';
import DimondScene from './DimondScene';
import Link from 'next/link';
import TransitionLink from '../components/ui/TransitionLink';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const diamondRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Staggered fade-in for sections
        gsap.from('.fade-in-section', {
            scrollTrigger: {
                trigger: '.fade-in-section',
                start: 'top 85%',
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.out"
        });

        // Parallax effect on large text
        gsap.to('.parallax-text', {
            scrollTrigger: {
                trigger: '.parallax-text',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -100,
            ease: 'none'
        });

        // Skill items reveal
        gsap.from('.skill-reveal', {
            scrollTrigger: {
                trigger: '.skills-wrapper',
                start: 'top 80%',
            },
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out"
        });

        // Diamond model scroll animation with responsive timeline
        if (diamondRef.current) {
            // Check if mobile or desktop
            const isMobile = window.innerWidth < 768;

            const diamondTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    // markers: true, // Uncomment for debugging
                }
            });

            if (isMobile) {
                // Mobile animation - simpler path, stays more centered
                diamondTimeline
                    .to(diamondRef.current, {
                        y: '80vh',
                        x: '0vw',
                        duration: 0.5,
                        ease: 'none'
                    })
                    .to(diamondRef.current, {
                        y: '160vh',
                        x: '0vw',
                        duration: 0.5,
                        ease: 'none'
                    });
            } else {
                // Desktop animation - full choreography
                diamondTimeline
                    // Phase 1: Move down and to the left (0-40%)
                    .to(diamondRef.current, {
                        y: '150vh',
                        x: '-30vw',
                        duration: 1.5,
                        ease: 'none'
                    })
                    // Phase 2: Move down and to the right (40-70%)
                    .to(diamondRef.current, {
                        y: '190vh',
                        x: '25vw',
                        duration: 0.5,
                        ease: 'none'
                    })
                    // Phase 3: Move down and center, straighten (70-100%)
                    .to(diamondRef.current, {
                        y: '260vh',
                        x: '-30vw',
                        rotation: 0,
                        duration: 0.5,
                        ease: 'none'
                    })
                    .to(diamondRef.current, {
                        y: '325vh',
                        x: '10vw',
                        rotation: 0,
                        duration: 0.5,
                        ease: 'none'
                    });
            }
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f5f5f5] text-[#262626]">
            <Header />

            <main className="relative pt-32 pb-32 px-6 md:px-12 lg:px-24 ">


                {/* Dimond Scene */}
                <div ref={diamondRef} className="absolute top-[2%] left-[50%] translate-x-[-50%] w-[60vw] h-[30vh] md:w-[30vw] md:h-[50vh]">
                    <DimondScene />
                </div>

                {/* Hero - Minimalist Introduction */}
                <section className="mb-40 md:mb-56">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
                        <div className="md:col-span-7">
                            <p className="text-sm uppercase tracking-[0.3em] opacity-40 mb-8 font-mono">
                                About
                            </p>
                            <h1 className="text-[13vw] md:text-[8vw] leading-[0.95] font-bold mb-12 tracking-tight">
                                Tejas
                            </h1>
                            <div className="space-y-6 text-lg md:text-xl leading-relaxed max-w-xl">
                                <p>
                                    I'm a creative developer based in India, specializing in crafting
                                    digital experiences that sit at the intersection of design and technology.
                                </p>
                                <p className="opacity-70">
                                    My work focuses on creating interfaces that feel intuitive,
                                    interactions that feel natural, and experiences that leave lasting impressions.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-5 space-y-8 md:pt-32">
                            <div className="border-t border-black/10 pt-6">
                                <p className="text-sm uppercase tracking-widest opacity-40 mb-2 font-mono">Location</p>
                                <p className="text-xl">India</p>
                            </div>
                            <div className="border-t border-black/10 pt-6">
                                <p className="text-sm uppercase tracking-widest opacity-40 mb-2 font-mono">Availability</p>
                                <p className="text-xl">Open for freelance</p>
                            </div>
                            <div className="border-t border-black/10 pt-6">
                                <p className="text-sm uppercase tracking-widest opacity-40 mb-2 font-mono">Focus</p>
                                <p className="text-xl">Web Development, UI/UX, Creative Coding</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Large Statement */}
                <section className="mb-40 md:mb-56 fade-in-section">
                    <div className="parallax-text">
                        <h2 className="text-[8vw] md:text-[6vw] leading-[1.1] font-display italic opacity-10">
                            "Design is not just what it looks like.
                            Design is how it works."
                        </h2>
                    </div>
                </section>

                {/* Skills - Minimalist List */}
                <section className="mb-40 md:mb-56 fade-in-section">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                        <div className="md:col-span-4">
                            <h3 className="text-4xl md:text-5xl font-bold mb-6">
                                Expertise
                            </h3>
                            <p className="opacity-60 leading-relaxed">
                                A curated set of skills honed through years of practice and passion.
                            </p>
                        </div>

                        <div className="md:col-span-8 skills-wrapper">
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                {[
                                    "React & Next.js",
                                    "TypeScript",
                                    "Three.js & WebGL",
                                    "GSAP Animation",
                                    "Node.js",
                                    "UI/UX Design",
                                    "Tailwind CSS",
                                    "MongoDB",
                                    "REST APIs",
                                    "Creative Coding",
                                    "Responsive Design",
                                    "Performance Optimization"
                                ].map((skill, index) => (
                                    <div
                                        key={index}
                                        className="skill-reveal flex items-center gap-4 py-3 border-b border-black/5 group cursor-default"
                                    >
                                        <span className="w-1 h-1 bg-black rounded-full group-hover:scale-150 transition-transform" />
                                        <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">
                                            {skill}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Philosophy */}
                <section className="mb-40 md:mb-56 fade-in-section">
                    <div className="max-w-4xl">
                        <p className="text-sm uppercase tracking-[0.3em] opacity-40 mb-8 font-mono">
                            Philosophy
                        </p>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl leading-[1.3] font-display mb-12">
                            I believe in creating experiences that are both beautiful and functional,
                            where every detail serves a purpose.
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            <div>
                                <h4 className="font-bold mb-3 text-lg">Simplicity</h4>
                                <p className="opacity-60 leading-relaxed text-sm">
                                    Less is more. Every element should have a reason to exist.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-3 text-lg">Attention to Detail</h4>
                                <p className="opacity-60 leading-relaxed text-sm">
                                    The smallest details make the biggest difference.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-3 text-lg">User-Centric</h4>
                                <p className="opacity-60 leading-relaxed text-sm">
                                    Design should solve problems, not create them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Approach */}
                <section className="mb-40 md:mb-56 fade-in-section">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                        <div className="md:col-span-4">
                            <h3 className="text-4xl md:text-5xl font-bold mb-6">
                                Approach
                            </h3>
                        </div>

                        <div className="md:col-span-8 space-y-12">
                            <div className="border-l-2 border-black pl-8">
                                <div className="text-sm font-mono opacity-40 mb-3">01</div>
                                <h4 className="text-2xl font-bold mb-4">Research & Discovery</h4>
                                <p className="opacity-60 leading-relaxed">
                                    Understanding the problem space, user needs, and business goals
                                    before jumping into solutions.
                                </p>
                            </div>

                            <div className="border-l-2 border-black/20 pl-8">
                                <div className="text-sm font-mono opacity-40 mb-3">02</div>
                                <h4 className="text-2xl font-bold mb-4">Design & Prototype</h4>
                                <p className="opacity-60 leading-relaxed">
                                    Creating intuitive interfaces and interactive prototypes that
                                    bring ideas to life.
                                </p>
                            </div>

                            <div className="border-l-2 border-black/20 pl-8">
                                <div className="text-sm font-mono opacity-40 mb-3">03</div>
                                <h4 className="text-2xl font-bold mb-4">Develop & Refine</h4>
                                <p className="opacity-60 leading-relaxed">
                                    Building with clean code, attention to performance, and
                                    continuous iteration based on feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA - Minimalist */}
                <section className="fade-in-section">
                    <div className="border-t border-black/10 pt-16">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                            <div>
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl leading-tight">
                                    Let's create something remarkable together
                                </h3>
                                <p className="text-lg opacity-60 max-w-xl">
                                    I'm always interested in hearing about new projects and opportunities.
                                </p>
                            </div>
                            <div>
                                <TransitionLink
                                    href="/contact"
                                    className="group inline-flex items-center gap-3 text-xl font-medium border-b-2 border-black pb-1 hover:gap-5 transition-all duration-300"
                                >
                                    Get in touch
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </TransitionLink>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
