"use client";

import React, { useEffect, useRef } from "react";
import styles from "./style.module.css";

/**
 * Cursor "spotlight reveal" background.
 *
 * A photo of rocky ground sits behind the section but is only visible through a
 * soft circle of light that trails the cursor, with a small white dot following behind.
 * Drop it inside any `position: relative` container as the first child; it
 * fills the container and ignores pointer events.
 */

/* Ground texture: "Rocks Ground 02" by Rob Tuytel, Poly Haven (CC0).
   https://polyhaven.com/a/rocks_ground_02 */
const GROUND_TEXTURE = "/images/textures/rocks-ground.jpg";

export default function SpotlightBackground({ radius = 380 }: { radius?: number }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const textureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    // Only download the ground photo once the section is about to be seen.
    let textureLoaded = false;
    const loadTexture = () => {
      if (textureLoaded || !textureRef.current) return;
      textureLoaded = true;
      textureRef.current.style.backgroundImage = `url(${GROUND_TEXTURE})`;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) layer.classList.add(styles.touch);
    layer.style.setProperty("--r", `${radius}px`);

    // target = where the cursor is, glow/dot = eased positions that trail it
    const target = { x: 0, y: 0 };
    const glow = { x: 0, y: 0 };
    const dot = { x: 0, y: 0 };
    let inside = false;
    let raf = 0;
    let visible = false;

    const apply = () => {
      layer.style.setProperty("--x", `${glow.x}px`);
      layer.style.setProperty("--y", `${glow.y}px`);
      layer.style.setProperty("--dx", `${dot.x}px`);
      layer.style.setProperty("--dy", `${dot.y}px`);
    };

    const tick = (t: number) => {
      if (isTouch) {
        // No cursor on touch screens: let the light wander slowly on its own.
        const rect = host.getBoundingClientRect();
        target.x = rect.width * (0.5 + 0.32 * Math.sin(t / 5200));
        target.y = rect.height * (0.5 + 0.28 * Math.sin(t / 3700 + 1.3));
      }
      // The light drifts lazily behind the cursor; the dot keeps up more closely.
      const ease = reduceMotion ? 1 : 0.045;
      const dotEase = reduceMotion ? 1 : 0.2;
      glow.x += (target.x - glow.x) * ease;
      glow.y += (target.y - glow.y) * ease;
      dot.x += (target.x - dot.x) * dotEase;
      dot.y += (target.y - dot.y) * dotEase;
      apply();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nowInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      target.x = x;
      target.y = y;
      if (nowInside && !inside) {
        // Jump straight to the cursor when entering so the glow doesn't slide in from far away.
        glow.x = dot.x = x;
        glow.y = dot.y = y;
        layer.classList.add(styles.active);
      } else if (!nowInside && inside) {
        layer.classList.remove(styles.active);
      }
      inside = nowInside;
      if (reduceMotion) apply();
      else start();
    };

    // Only animate while the section is on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) loadTexture();
      if (visible && isTouch) {
        layer.classList.add(styles.active);
        if (!reduceMotion) start();
        else {
          const rect = host.getBoundingClientRect();
          glow.x = dot.x = target.x = rect.width / 2;
          glow.y = dot.y = target.y = rect.height / 2;
          apply();
        }
      }
    });
    io.observe(host);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [radius]);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <div ref={textureRef} className={styles.texture} />
      <div className={styles.glow} />
      <div className={styles.dot} />
    </div>
  );
}
