import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticWrapper({ children }) {
  const magnetic = useRef(null);

  useEffect(() => {
    // Create a variable to store the current ref value
    const magneticDOM = magnetic.current;

    const xTo = gsap.quickTo(magneticDOM, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(magneticDOM, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magneticDOM.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    // Add event listeners
    magneticDOM.addEventListener("mousemove", handleMouseMove);
    magneticDOM.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup function using the stored variable
    return () => {
      magneticDOM.removeEventListener("mousemove", handleMouseMove);
      magneticDOM.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [children]); // Include children in dependency array if needed

  return (
    React.cloneElement(children, { ref: magnetic })
  );
}
