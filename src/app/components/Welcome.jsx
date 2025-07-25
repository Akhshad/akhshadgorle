'use client';
import { useRef, useEffect } from 'react';
import styles from './page.module.css';
export default function Home() {
  
  const container = useRef(null);
  const stickyMask = useRef(null);

  const initialMaskSize = 0.8;
  const targetMaskSize = 150;
  const easing = 0.15;
  const easedScrollProgress = useRef(0); // Use useRef to preserve value across renders

  useEffect(() => {
    const animate = () => {
      if (!stickyMask.current || !container.current) return;
      const maskSizeProgress = targetMaskSize * getScrollProgress();
      stickyMask.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 100 + "%";
      requestAnimationFrame(animate);
    };

    const getScrollProgress = () => {
      if (!stickyMask.current || !container.current) return 0;
      const scrollProgress =
        stickyMask.current.offsetTop / (container.current.getBoundingClientRect().height - window.innerHeight);
      const delta = scrollProgress - easedScrollProgress.current; // Access current value
      easedScrollProgress.current += delta * easing; // Update current value
      return easedScrollProgress.current;
    };

    requestAnimationFrame(animate);
  }, [easing, initialMaskSize, targetMaskSize, container]); // Added container to dependencies

  return (
   
    <main className={styles.main}>
      <div ref={container} className={styles.container}>
        <div ref={stickyMask} className={styles.stickyMask}>
          <video autoPlay muted loop>
            <source src="/images/INTS.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
    
  );
}
