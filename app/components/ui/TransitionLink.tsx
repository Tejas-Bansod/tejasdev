'use client';

import Link, { LinkProps } from 'next/link';
import React from 'react';
import { useTransition } from '../../context/TransitionContext';
import { usePathname } from 'next/navigation';

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    style?: React.CSSProperties;
}

export default function TransitionLink({
    children,
    href,
    onClick,
    ...props
}: TransitionLinkProps) {
    const { initiateTransition } = useTransition();
    const pathname = usePathname();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        // If there's an existing onClick handler, call it first
        if (onClick) {
            onClick(e);
        }

        // Don't transition if we're already on the page
        if (pathname === href) return;

        // If it's a hash link, just prevent default (if it's just '#') or let it behave normally (if it's an anchor on the page)
        // For the specific case of href="#" used as a button trigger:
        if (href.toString() === '#') {
            e.preventDefault();
            return;
        }

        // If it's an anchor link like "#section", we might want to let it scroll or handle it with lenis.
        // For now, let's assume we don't want page transitions for any hash links.
        if (href.toString().startsWith('#')) {
            // e.preventDefault(); // Optional: decide if we want to stop smooth scroll
            return;
        }

        e.preventDefault();
        await initiateTransition(href.toString());
    };

    return (
        <Link href={href} onClick={handleTransition} {...props}>
            {children}
        </Link>
    );
}
