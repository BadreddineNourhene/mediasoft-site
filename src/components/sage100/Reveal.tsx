"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Ajoute data-on="true" quand le bloc arrive à l'écran : les animations CSS (.s100-g-*) se déclenchent. */
export default function Reveal({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-on={on} className={className}>
      {children}
    </div>
  );
}
