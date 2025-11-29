'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const columns = container.querySelectorAll('.transition-column');

        const handleStart = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { onComplete } = customEvent.detail;

            const tl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            // Reset columns
            tl.set(container, { display: 'flex' })
                .set(columns, { scaleY: 0, transformOrigin: 'bottom' });

            // Animate columns in (staggered)
            tl.to(columns, {
                scaleY: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power4.inOut',
            });
        };

        window.addEventListener('page-transition-start', handleStart);

        return () => {
            window.removeEventListener('page-transition-start', handleStart);
        };
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        const columns = container.querySelectorAll('.transition-column');

        const tl = gsap.timeline();

        // Animate columns out (staggered reverse)
        // We change transformOrigin to top so they shrink upwards
        tl.set(columns, { transformOrigin: 'top' })
            .to(columns, {
                scaleY: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power4.inOut',
                delay: 0.1
            })
            .set(container, { display: 'none' });

    }, [pathname]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9998] flex pointer-events-none"
            style={{
                display: 'none',
            }}
        >
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="transition-column flex-1 h-full"
                    style={{
                        backgroundColor: '#262626',
                        backdropFilter: 'blur(100px)',
                        transform: 'scaleY(0)',
                        willChange: 'transform',
                        // Removed border to prevent lines
                        marginLeft: i > 0 ? '-1px' : '0', // Slight overlap to prevent sub-pixel gaps
                        width: 'calc(20% + 1px)' // Ensure full coverage
                    }}
                />
            ))}
        </div>
    );
}
