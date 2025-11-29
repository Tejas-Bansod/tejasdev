'use client';
import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { X, ArrowUpRight, Mail, Github, Linkedin, Instagram } from 'lucide-react';
import { useTransition } from '../../context/TransitionContext';
import { usePathname } from 'next/navigation';

interface MenuOverlayProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const menuLinks = [
    { label: 'HOME', href: '/', index: '01' },
    { label: 'WORK', href: '/work', index: '02' },
    { label: 'ABOUT', href: '/about', index: '03' },
    { label: 'CONTACT', href: '/contact', index: '04' },
];

const socialLinks = [
    { icon: Mail, href: 'mailto:tejas.bansod.work@gmail.com', label: 'Email' },
    { icon: Github, href: 'https://github.com/Tejas-Bansod', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/tejas-bansod-profile/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/itstejasbansod', label: 'Instagram' },
];

export default function MenuOverlay({ isOpen, setIsOpen }: MenuOverlayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);
    const [currentTime, setCurrentTime] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Update time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useGSAP(() => {
        gsap.set(containerRef.current, {
            clipPath: 'circle(0% at 50% 0%)',
            display: 'none',
        });

        tl.current = gsap.timeline({ paused: true })
            .to(containerRef.current, {
                display: 'flex',
                duration: 0,
            })
            .to(containerRef.current, {
                clipPath: 'circle(150% at 50% 50%)',
                duration: 1.5,
                ease: 'power4.inOut',
            })
            .from('.menu-link-item', {
                y: 100,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out',
            }, '-=0.5')
            .from('.menu-footer', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            }, '-=0.3')
            .from('.floating-orb', {
                scale: 0,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            }, '-=1');

    }, { scope: containerRef });

    useGSAP(() => {
        if (isOpen) {
            tl.current?.play();
        } else {
            tl.current?.reverse();
        }
    }, [isOpen]);

    // Add hover effect for menu items
    useEffect(() => {
        const menuItems = menuItemsRef.current?.querySelectorAll('.menu-link-item');
        if (!menuItems) return;

        menuItems.forEach((item) => {
            const originalLetters = item.querySelectorAll('.original span');
            const cloneLetters = item.querySelectorAll('.clone span');
            const arrow = item.querySelector('.menu-arrow');

            const hoverTl = gsap.timeline({ paused: true });

            hoverTl.to([originalLetters, cloneLetters], {
                yPercent: -110,
                duration: 0.6,
                ease: 'power3.out',
                stagger: { each: 0.015, from: 'start' },
            })
                .to(arrow, {
                    x: 5,
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out',
                }, 0);

            item.addEventListener('mouseenter', () => hoverTl.play());
            item.addEventListener('mouseleave', () => hoverTl.reverse());
        });
    }, []);

    // Animate floating orbs based on mouse position
    useEffect(() => {
        if (!isOpen) return;

        const orbs = document.querySelectorAll('.floating-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mousePosition.x - window.innerWidth / 2) * speed;
            const y = (mousePosition.y - window.innerHeight / 2) * speed;

            gsap.to(orb, {
                x,
                y,
                duration: 1,
                ease: 'power2.out',
            });
        });
    }, [mousePosition, isOpen]);

    const { initiateTransition } = useTransition();
    const pathname = usePathname(); // Import this from 'next/navigation'

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (pathname === href) {
            setIsOpen(false);
            return;
        }

        setIsOpen(false);

        // Wait for the menu closing animation (approx 1.5s) before starting the page transition
        // We can adjust this timing if it feels too slow
        setTimeout(() => {
            initiateTransition(href);
        }, 1000); // 1s delay - overlapping slightly with the end of the menu close for smoother feel
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white overflow-hidden"
            style={{
                display: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
            }}
        >
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 pointer-events-none" ref={backgroundRef}>
                <div
                    className="floating-orb absolute w-64 h-64 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                        top: '10%',
                        left: '10%',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    className="floating-orb absolute w-96 h-96 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                        bottom: '10%',
                        right: '10%',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    className="floating-orb absolute w-80 h-80 rounded-full opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                        top: '50%',
                        right: '20%',
                        filter: 'blur(50px)',
                    }}
                />
            </div>

            {/* Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:opacity-70 transition-all hover:rotate-90 duration-300 z-10"
                aria-label="Close menu"
            >
                <X size={28} className="md:w-8 md:h-8" />
            </button>

            {/* Time Display - Top Left */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 text-sm md:text-base opacity-60 font-mono">
                {currentTime}
            </div>

            {/* Main Menu */}
            <nav ref={menuItemsRef} className="flex flex-col items-center gap-4 md:gap-8 px-4">
                {menuLinks.map((link, index) => (
                    <div
                        key={index}
                        className="overflow-hidden relative group"
                        style={{ height: 'auto', minHeight: '1.2em' }}
                    >
                        <a
                            href={link.href}
                            className="menu-link-item flex items-center gap-3 md:gap-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold transition-colors"
                            onClick={(e) => handleLinkClick(e, link.href)}
                            style={{
                                position: 'relative',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                lineHeight: '1.2em',
                            }}
                        >
                            {/* Index Number */}
                            <span className="text-xs md:text-sm opacity-50 font-mono self-start mt-1 md:mt-2">
                                {link.index}
                            </span>

                            {/* Text with hover effect */}
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                <div
                                    className="original"
                                    style={{
                                        position: 'relative',
                                        whiteSpace: 'nowrap',
                                        lineHeight: '1.2em',
                                    }}
                                >
                                    {[...link.label].map((char, idx) => (
                                        <span
                                            key={`orig-${idx}`}
                                            style={{
                                                display: 'inline-block',
                                                transform: 'translateY(0%)',
                                                willChange: 'transform',
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    ))}
                                </div>
                                <div
                                    className="clone"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        whiteSpace: 'nowrap',
                                        lineHeight: '1.2em',
                                    }}
                                >
                                    {[...link.label].map((char, idx) => (
                                        <span
                                            key={`clone-${idx}`}
                                            style={{
                                                display: 'inline-block',
                                                transform: 'translateY(0%)',
                                                willChange: 'transform',
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <ArrowUpRight
                                className="menu-arrow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 md:w-10 md:h-10"
                            />
                        </a>
                    </div>
                ))}
            </nav>

            {/* Footer Section */}
            <div className="menu-footer absolute bottom-4 md:bottom-8 left-4 right-4 md:left-8 md:right-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                    {/* Social Links */}
                    <div className="flex gap-4 md:gap-6">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-60 hover:opacity-100 transition-all hover:scale-110 duration-300"
                                aria-label={social.label}
                            >
                                <social.icon size={20} className="md:w-6 md:h-6" />
                            </a>
                        ))}
                    </div>

                    {/* Location */}
                    <div className="text-xs md:text-sm opacity-60 text-center md:text-right">
                        <p>Based in India</p>
                        <p className="mt-1">Available for freelance work</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
