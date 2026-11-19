"use client";

import { RefObject, useEffect } from "react";

/**
 * Fades text to grey around the cursor while it's over a section, then lets it
 * return to full white once the cursor moves on. Pairs with <SpotlightBackground />.
 *
 * Every element inside `sectionRef` that matches `selector` gets a soft circular
 * CSS mask whose centre and size ease towards the cursor. Off on touch screens.
 */
export function useTextSpotlight(
  sectionRef: RefObject<HTMLElement | null>,
  selector = "[data-spotlight-text]",
  radius = 150,
  /** pass false until the section's content has rendered */
  enabled = true
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section || window.matchMedia("(hover: none)").matches) return;

    const elements = Array.from(section.querySelectorAll<HTMLElement>(selector));
    const mask =
      "radial-gradient(circle var(--tr, 0px) at var(--tx, -999px) var(--ty, -999px), " +
      "rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.45) 45%, #000 100%)";
    for (const el of elements) {
      el.style.setProperty("mask-image", mask);
      el.style.setProperty("-webkit-mask-image", mask);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0, y: 0, r: 0 };
    const eased = { x: 0, y: 0, r: 0 };
    let raf = 0;

    const tick = () => {
      const k = reduceMotion ? 1 : 0.12;
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;
      eased.r += (target.r - eased.r) * (reduceMotion ? 1 : 0.08);
      if (Math.abs(target.r - eased.r) < 0.5) eased.r = target.r; // snap fully closed/open
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--tx", `${eased.x - rect.left}px`);
        el.style.setProperty("--ty", `${eased.y - rect.top}px`);
        el.style.setProperty("--tr", `${eased.r.toFixed(1)}px`);
      }
      const settled =
        Math.abs(target.x - eased.x) < 0.5 &&
        Math.abs(target.y - eased.y) < 0.5 &&
        eased.r === target.r;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = section.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inside && target.r === 0) {
        eased.x = e.clientX; // start the fade where the cursor enters
        eased.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      target.r = inside ? radius : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      for (const el of elements) {
        el.style.removeProperty("mask-image");
        el.style.removeProperty("-webkit-mask-image");
      }
    };
  }, [sectionRef, selector, radius, enabled]);
}
