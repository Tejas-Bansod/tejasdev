'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import styles from './page.module.css';

interface MenuItem {
  label: string;
  href: string;
}

interface HoverMenuProps {
  items: MenuItem[];
}

export default function HoverMenu({ items }: HoverMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const menuItems = menuRef.current?.querySelectorAll('.menu-item');
    if (!menuItems) return;

    menuItems.forEach((item) => {
      const originalLetters = item.querySelectorAll('.original span');
      const cloneLetters = item.querySelectorAll('.clone span');

      const tl = gsap.timeline({ paused: true });

      // 👇 Stagger from the center, both sets in sync
      tl.to(originalLetters, {
        yPercent: -110,
        duration: 0.6,
        ease: 'power3.out',
        stagger: { each: 0.01, from: 'center' }, // 👈 center stagger
      }, 0)
      .to(cloneLetters, {
        yPercent: -105,
        duration: 0.6,
        ease: 'power3.out',
        stagger: { each: 0.01, from: 'center' }, // 👈 match same timing
      }, 0);

      item.addEventListener('mouseenter', () => tl.play());
      item.addEventListener('mouseleave', () => tl.reverse());
    });
  }, []);

  return (
    <div ref={menuRef} className={styles.menu}>
      {items.map((item, i) => (
        <Link key={i} href={item.href} className={`menu-item ${styles.menuItem}`}>
          <div className="original">
            {[...item.label].map((char, idx) => (
              <span key={`orig-${idx}`}>{char}</span>
            ))}
          </div>
          <div className="clone">
            {[...item.label].map((char, idx) => (
              <span key={`clone-${idx}`}>{char}</span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
