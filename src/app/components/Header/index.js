'use client'; // Mark `Header` as a Client Component (Solution 1)
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Nav from './nav'; // Import the Nav component
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Rounded from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  // Handle pathname changes to reset active state
  useEffect(() => {
    setIsActive(false); // Reset active state on pathname change
  }, [pathname]); // Only depend on pathname

  // GSAP animation setup (consider adding comments for clarity)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" }),
        onEnterBack: () =>
          gsap.to(button.current, { scale: 0, duration: 0.25, ease: "power1.out" }),
      },
    });
  }, []);

  return (
    <>
      <div ref={header} className={styles.header}>
        {/* Add your desired header content here */}
        {/* Example:
          <div className={styles.logo}>
            <p className={styles.copyright}>©</p>
            <div className={styles.name}>
              <p className={styles.codeBy}>Code by</p>
              <p className={styles.Akhshad}>Akhshad</p>
              <p className={styles.Gorle}>Gorle</p>
            </div>
          </div>
        */}
        <div className={styles.nav}>
          <Magnetic>
            <div className={styles.el}>
              <a href='/'>Home</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a href="https://www.behance.net/akhshadgorle" target="_blank" rel="noopener noreferrer">Behance</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          {/* <Magnetic>
            <div className={styles.el}>
              <a href="/contact" target="_blank" rel="noopener noreferrer">Contact</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic> */}
        </div>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded onClick={() => setIsActive(!isActive)} className={`${styles.button}`}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Nav />}
      </AnimatePresence>
    </>
  );
}
