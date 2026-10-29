/* Illustration Microsoft : les applications Microsoft 365 et Power BI en orbite (icônes officielles du site d'origine). */
const apps = [
  ["word", "Word"],
  ["excel", "Excel"],
  ["powerpoint", "PowerPoint"],
  ["outlook", "Outlook"],
  ["mssteam", "Teams"],
  ["onedrive", "OneDrive"],
  ["sharepoint", "SharePoint"],
  ["onenote", "OneNote"],
  ["mspowerBi", "Power BI"],
] as const;

export default function M365Orbit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square w-full max-w-[520px] ${className}`}>
      <div className="absolute inset-[18%] rounded-full border border-dashed border-[#d83b01]/30" aria-hidden />
      <div className="absolute inset-[4%] rounded-full border border-[#0b1a2e]/10" aria-hidden />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-[27%] w-[27%] place-items-center rounded-[28%] bg-white shadow-[0_30px_60px_-24px_rgb(11_26_46/0.45)] ring-1 ring-[#0b1a2e]/5">
          <img src="/img/logos/logo-microsoft-365.png" alt="Microsoft 365" className="h-[52%] w-auto" loading="lazy" />
        </div>
      </div>
      <div className="m365-orbit absolute inset-0" aria-hidden>
        {apps.map(([icon, label], i) => {
          const a = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
          const r = i % 2 ? 41 : 32;
          return (
            <div
              key={icon}
              className="absolute"
              style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%`, transform: "translate(-50%,-50%)" }}
            >
              <div className="m365-counter grid h-11 w-11 place-items-center rounded-xl bg-white shadow-[0_16px_30px_-14px_rgb(11_26_46/0.45)] ring-1 ring-[#0b1a2e]/5 md:h-[56px] md:w-[56px] md:rounded-2xl" title={label}>
                <img src={`/img/m365/${icon}.svg`} alt="" className="h-6 w-6 md:h-7 md:w-7" loading="lazy" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
