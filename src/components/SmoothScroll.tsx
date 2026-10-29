"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Défilement fluide Lenis, piloté par le ticker GSAP pour rester synchronisé avec ScrollTrigger.
   Lenis respecte prefers-reduced-motion par défaut (respectReducedMotion). */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ anchors: { offset: -88 }, allowNestedScroll: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
