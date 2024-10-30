'use client';
import { useRef, useEffect } from 'react';
import styles from './page.module.css';
export default function Home() {
  
  const container = useRef(null);
  const stickyMask = useRef(null);

  const initialMaskSize = 0.8;
  const targetMaskSize = 150;
  const easing = 0.15;
  let easedScrollProgress = 0;

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
      const delta = scrollProgress - easedScrollProgress;
      easedScrollProgress += delta * easing;
      return easedScrollProgress;
    };

    requestAnimationFrame(animate);
  }, [easing, initialMaskSize, targetMaskSize]);

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
