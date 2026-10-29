"use client";

import LogoLoop from "@/components/reactbits/LogoLoop";
import { m365Apps } from "@/lib/m365";

export default function M365AppsLoop() {
  return (
    <section aria-label="Applications et services" className="border-b border-line bg-white">
      <div className="container-x flex flex-col items-center gap-6 py-8 md:flex-row md:gap-10">
        <p className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Applications et services</p>
        <div className="w-full min-w-0 flex-1">
          <LogoLoop
            logos={m365Apps.map(([f, label]) => ({ src: `/img/m365/${f}.svg`, alt: label, title: label }))}
            speed={45}
            logoHeight={36}
            gap={56}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            labels="hover"
            ariaLabel="Applications Microsoft 365"
          />
        </div>
      </div>
    </section>
  );
}
