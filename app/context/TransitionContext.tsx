'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

interface TransitionContextType {
    timeline: gsap.core.Timeline;
    initiateTransition: (href: string) => Promise<void>;
    isFirstVisit: boolean;
    setIsFirstVisit: (value: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType>({
    timeline: gsap.timeline(),
    initiateTransition: async () => { },
    isFirstVisit: true,
    setIsFirstVisit: () => { },
});

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const timeline = useRef(gsap.timeline({ paused: true }));
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Check if it's the first visit
        const visited = sessionStorage.getItem('hasVisited');
        if (visited) {
            setIsFirstVisit(false);
        } else {
            // We'll set it to true initially, and the Preloader will set it to false when done
            setIsFirstVisit(true);
        }
    }, []);

    const initiateTransition = async (href: string) => {
        if (pathname === href || isTransitioning) return;

        setIsTransitioning(true);

        // 1. Animate Out (Cover the screen)
        // We'll use a custom event or a shared ref to trigger the animation in the PageTransition component
        // For now, let's assume we have a way to trigger it. 
        // A simple way is to expose a method from PageTransition via another context or ref, 
        // but keeping it simple: we'll use a class or global state if needed, 
        // OR we can just use the timeline we passed down if we structure it right.

        // Better approach: The PageTransition component subscribes to this context 
        // and plays an animation when a state changes.

        return new Promise<void>((resolve) => {
            // This promise resolves when the "enter" animation (covering screen) is done
            // We can use a custom event for decoupling
            const event = new CustomEvent('page-transition-start', {
                detail: {
                    href,
                    onComplete: () => {
                        router.push(href);
                        // The 'page-transition-end' will be triggered by the new page mounting 
                        // or by the PageTransition component detecting pathname change
                        setIsTransitioning(false);
                        resolve();
                    }
                }
            });
            window.dispatchEvent(event);
        });
    };

    return (
        <TransitionContext.Provider value={{ timeline: timeline.current, initiateTransition, isFirstVisit, setIsFirstVisit }}>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext);
