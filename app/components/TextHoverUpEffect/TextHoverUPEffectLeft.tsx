'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TransitionLink from '../ui/TransitionLink';
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

      tl.to([originalLetters, cloneLetters], {
        yPercent: -110,
        duration: 0.6,
        ease: 'power3.out',
        stagger: { each: 0.015, from: 'start' },
      });

      item.addEventListener('mouseenter', () => tl.play());
      item.addEventListener('mouseleave', () => tl.reverse());
    });
  }, []);

  return (
    <div ref={menuRef} className={styles.menu}>
      {items.map((item, i) => (
        <TransitionLink key={i} href={item.href} className={`menu-item ${styles.menuItem}`}>
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
        </TransitionLink>
      ))}
    </div>
  );
}
