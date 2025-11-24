'use client';
import { useState } from 'react';
import TextHoverUPEffectLeft from "../Effects/TextHoverUpEffect/TextHoverUPEffectLeft";
import MenuOverlay from "./MenuOverlay";
import Link from 'next/link';

export default function Header({ className }: { className?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const items = [
        {
            label: "GET  IN  TOUCH  ⟶", href: "#",
        }
    ]

    const Menu = [
        {
            label: "MENU", href: "#",
        }
    ]

    return (
        <header className={`${className} relative z-50`}>
            <MenuOverlay isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

            {/* Mobile Layout - Menu on Right */}
            <div className="flex md:hidden justify-between items-center py-6 px-6">
                <Link href="/" className="logo text-2xl font-bold">
                    Tejas.
                </Link>
                <div
                    className="Menu cursor-pointer"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <TextHoverUPEffectLeft items={Menu} />
                </div>
            </div>

            {/* Desktop Layout - Menu in Center */}
            <div className="hidden md:grid grid-cols-3 items-center py-6 px-12 lg:px-24">
                {/* Left - Logo */}
                <Link href="/" className="logo text-2xl font-bold">
                    Tejas.
                </Link>

                {/* Center - Menu Button */}
                <div
                    className="Menu flex justify-center items-center cursor-pointer"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <TextHoverUPEffectLeft items={Menu} />
                </div>

                {/* Right - Get in Touch */}
                <div className="flex justify-end">
                    <Link href="/contact" className="hover:text-accent text-xl  transition-colors duration-300">
                        Get in Touch ⟶
                    </Link>
                </div>
            </div>
        </header>
    )
}