"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Code2, LayoutTemplate, Palette, Menu, X } from "lucide-react";
import Nav from "../Header/nav";
import styles from "./style.module.css";

/**
 * Liquid-glass bottom navigation for phones. Hidden on wider screens (CSS).
 * Uses client-side links so the music keeps playing between pages.
 * "More" opens the existing slide-out menu with every page.
 */
const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/wd", label: "Web", Icon: Code2 },
  { href: "/ui-ux", label: "UI/UX", Icon: LayoutTemplate },
  { href: "/gd", label: "Graphic", Icon: Palette },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Only Chromium browsers (Chrome, Brave, Edge) can refract the background
  // through an SVG backdrop filter; others keep the frosted-glass fallback.
  useEffect(() => {
    if ("userAgentData" in navigator) {
      document.documentElement.setAttribute("data-liquid-glass", "");
    }
  }, []);

  const activeHref = menuOpen
    ? "more"
    : tabs.find((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href)))?.href ?? "more";

  return (
    <>
      {/* Liquid-glass refraction: a smooth, low-frequency noise field displaces
          whatever is behind the glass, so it appears to bend through a curved lens.
          Used by the bar here and by the compact music player (Chromium only). */}
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <filter id="liquid-glass-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="2" seed="11" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="smoothNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothNoise"
            scale="38"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <AnimatePresence mode="wait">{menuOpen && <Nav />}</AnimatePresence>

      <nav className={styles.wrap} aria-label="Main">
        <div className={styles.bar}>
          {tabs.map(({ href, label, Icon }) => {
            const active = activeHref === href;
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.item} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-nav-bubble"
                    className={styles.bubble}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon aria-hidden="true" />
                <span className={styles.label}>{label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            className={`${styles.item} ${activeHref === "more" ? styles.active : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "More pages"}
          >
            {activeHref === "more" && (
              <motion.span
                layoutId="mobile-nav-bubble"
                className={styles.bubble}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className={styles.label}>{menuOpen ? "Close" : "More"}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
