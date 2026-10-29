/* Ordinateur portable dessiné en CSS, avec une vraie capture d'écran du logiciel à l'intérieur.
   Remplace les photos d'ordinateur sur fond blanc : appareil entier, sans fond ni découpe. */
export default function Laptop({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <figure className={`relative ${className}`}>
      {/* Écran */}
      <div className="relative mx-auto w-[86%] rounded-t-[14px] rounded-b-[4px] bg-[#16181d] p-[1.6%] pb-[2.2%] shadow-[0_40px_60px_-25px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <span className="absolute left-1/2 top-[0.6%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25" aria-hidden />
        <div className="overflow-hidden rounded-[4px] bg-white">
          <img src={src} alt={alt} className="block aspect-video h-auto w-full object-cover object-left-top" loading={eager ? "eager" : "lazy"} decoding="async" />
        </div>
      </div>
      {/* Base */}
      <div className="relative mx-auto h-[10px] w-full rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#d9dde4] to-[#9aa1ad] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)] md:h-[14px]" aria-hidden>
        <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[6px] bg-[#7d8592]" />
      </div>
    </figure>
  );
}
