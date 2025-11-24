'use client';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Header from '../components/header/header';
import { ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const BoxScene = dynamic(() => import('./BoxScene'), {
    ssr: false,
    loading: () => <div className="w-full h-full" />
});

const DistortedText = dynamic(() => import('../components/DistortedText'), {
    ssr: false,
    loading: () => <div className="w-full h-full" /> // Optional loading state
});

const projects = [
    {
        id: 1,
        title: "Recipe APP",
        category: "Web Design & Development",
        year: "2025",
        description: "A recipe app for finding recipes.",
        color: "#F5F5F5",
        image: "images/recipe-app.gif",
        link: "https://recipe-app-phi-woad.vercel.app/"

    },
    {
        id: 2,
        title: "Interactive Cursor Effect",
        category: "Web Design & Development",
        year: "2025",
        description: "An interactive cursor effect using WebGL.",
        color: "#F0F0F0",
        image: "images/Drawing-Cursor.gif",
        link: "https://drawing-cursor-effect.vercel.app/"
    },
    {
        id: 3,
        title: "Water Distortion Effect",
        category: "Web Design & Development",
        year: "2025",
        description: "A water distortion effect using WebGL.",
        color: "#F0F0F0",
        image: "images/water-effect.gif",
        link: "https://liquid-distortion-effect-pi.vercel.app/"
    },
    {
        id: 4,
        title: "Tution Classes Platform",
        category: "Web Design & Development",
        year: "2025",
        description: "A platform for tution classes.",
        color: "#E5E5E5",
        image: "images/tution-classes.gif",
        link: ""
    },
    {
        id: 5,
        title: "Marketing Email Web APP",
        category: "Web Design & Development",
        year: "2025",
        description: "A web application for sending marketing emails.",
        color: "#EEEEEE",
        image: "images/marketing-email.gif",
        link: ""

    },
    {
        id: 6,
        title: "Genrative AI Chatbot",
        category: "Web Design & Development",
        year: "2025",
        description: "A chatbot for generating AI content.",
        color: "#E8E8E8",
        image: "images/chatgpt.gif",
        link: ""
    }
];

export default function WorkPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorInnerRef = useRef<HTMLDivElement>(null);
    const [activeProject, setActiveProject] = useState<number | null>(null);
    const xTo = useRef<((value: number) => void) | null>(null);
    const yTo = useRef<((value: number) => void) | null>(null);
    const xPrev = useRef<number>(0);

    useGSAP(() => {
        // Setup quickSet for performance
        xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
        yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

        // Initial page load animation
        const tl = gsap.timeline();

        tl.from('.work-title-char', {
            yPercent: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out"
        })
            .from('.project-item', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.5")
            .from('.box-scene', {
                opacity: 0,
                scale: 0.8,
                duration: 1.5,
                ease: "power3.out"
            }, "-=1");

        // Custom cursor animation
        const moveCursor = (e: MouseEvent) => {
            if (!cursorRef.current) return;
            if (xTo.current) xTo.current(e.clientX);
            if (yTo.current) yTo.current(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, { scope: containerRef });

    // Handle hover effects
    const handleMouseEnter = (id: number) => {
        setActiveProject(id);
        gsap.to(cursorRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        setActiveProject(null);
        gsap.to(cursorRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen overflow-hidden bg-[#f5f5f5] text-[#262626] selection:bg-black selection:text-white">
            <Header />

            {/* Custom Cursor / Image Reveal */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-[550px] h-[350px] pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 hidden md:block overflow-hidden rounded-lg shadow-2xl"
            >
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${activeProject === project.id ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundColor: project.color }}
                    >
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-black/5 to-black/20 flex items-center justify-center">
                                <span className="text-4xl font-display opacity-20">{project.title}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <main className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-[1920px] mx-auto relative">
                {/* Page Title & 3D Element */}
                <div className="mb-24 md:mb-32 relative">
                    {/* Distorted Text Overlay */}
                    <div className="absolute mt-[-40px] inset-0 z-20 w-[60vw] h-auto">
                        <DistortedText text={`CREATIVE\nWORKS`} />
                    </div>

                    <div className="flex opacity-0 pointer-events-none">
                        <div className="relative z-10 overflow-hidden">
                            <h1 className="text-[12vw] leading-[0.85] font-bold tracking-wide uppercase ">
                                {"Creative".split('').map((char, i) => (
                                    <span key={i} className="work-title-char inline-block ">{char}</span>
                                ))}
                                <br />
                                {"Works".split('').map((char, i) => (
                                    <span key={i} className="work-title-char inline-block">{char}</span>
                                ))}
                            </h1>
                        </div>
                    </div>

                    {/* 3D Model - Positioned absolutely */}
                    <div
                        className="absolute top-0 right-0 -mt-44 -mr-14 md:mt-0 md:inset-0 z-30 flex items-start md:items-center justify-end pointer-events-none"
                        style={{
                            perspective: '1000px',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <div className="w-[300px] md:w-[600px] h-[300px] md:h-[70vh] pointer-events-auto">
                            <BoxScene />
                        </div>
                    </div>



                    <div className="mt-8 flex justify-end relative z-10">
                        <p className="text-sm md:text-base max-w-md text-right opacity-60 font-sans">
                            A curated collection of digital experiences,
                            interfaces, and brand identities crafted with precision and passion.
                        </p>
                    </div>
                </div>

                {/* Projects List */}
                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="project-item group relative border-t border-black/10 transition-colors duration-300 -mx-4 md:-mx-8 lg:-mx-16 hover:bg-black/5"
                            onMouseEnter={() => handleMouseEnter(project.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {project.link ? (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-12 py-12 md:py-16 px-4 md:px-8 lg:px-16"
                                >
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium group-hover:translate-x-4 transition-transform duration-500 ease-out">
                                            {project.title}
                                        </h2>
                                        <p className="mt-2 md:mt-4 text-sm md:text-base opacity-60 md:opacity-0 md:group-hover:opacity-60 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 ease-out pl-0 md:pl-4">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16 md:w-1/3">
                                        <div className="flex flex-col items-start md:items-end">
                                            <span className="text-xs uppercase tracking-widest opacity-50 mb-1">Category</span>
                                            <span className="text-sm md:text-base">{project.category}</span>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end">
                                            <span className="text-xs uppercase tracking-widest opacity-50 mb-1">Year</span>
                                            <span className="text-sm md:text-base font-mono">{project.year}</span>
                                        </div>
                                        <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block" />
                                    </div>
                                </a>
                            ) : (
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-12 py-12 md:py-16 px-4 md:px-8 lg:px-16 cursor-not-allowed">
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium">
                                            {project.title}
                                        </h2>
                                        <p className="mt-2 md:mt-4 text-sm md:text-base opacity-60 pl-0 md:pl-4">
                                            {project.description}
                                        </p>
                                        <p className="mt-2 text-xs md:text-sm opacity-40 italic pl-0 md:pl-4">
                                            Due to privacy reasons, the link is not available for this project
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16 md:w-1/3">
                                        <div className="flex flex-col items-start md:items-end">
                                            <span className="text-xs uppercase tracking-widest opacity-50 mb-1">Category</span>
                                            <span className="text-sm md:text-base">{project.category}</span>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end">
                                            <span className="text-xs uppercase tracking-widest opacity-50 mb-1">Year</span>
                                            <span className="text-sm md:text-base font-mono">{project.year}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="border-t border-black/10" />
                </div>
            </main>
        </div>
    );
}
