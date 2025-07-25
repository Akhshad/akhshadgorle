import React, { useState } from 'react';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../animation'; // Import animation configuration
import Link from './Link'; // Import Link component
import Curve from './Curve'; // Import Curve component
import Footer from './Footer'; // Import Footer component

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Web Development",
    href: "/wd",
  },
  {
    title: "UI/UX Design",
    href: "/ui-ux",
  },
  {
    title: "Graphic Design",
    href: "/gd",
  },
  {
    title: "Case Study",
    href: "/case_study",
  },
  {
    title: "Ios Ui",
    href: "/ios_ui",
  },
 
];

function Nav() {
  const pathname = usePathname(); // Use usePathname Hook here
  const [selectedIndicator, setSelectedIndicator] = useState(pathname); // Use useState Hook here

  return (
    <motion.div
      variants={menuSlide} // Apply animation variants
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div onMouseLeave={() => setSelectedIndicator(pathname)} className={styles.nav}>
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>
        {/* <Footer /> */}
      </div>
      <Curve />
    </motion.div>
  );
}

export default Nav;
