/* Capture réelle d'un logiciel, posée sans cadre de fenêtre : coins arrondis et ombre pour un écran à plat,
   simple ombre portée pour un appareil détouré (fichier « -detoure », sans fond). */
export default function AppWindow({
  src,
  alt,
  className = "",
  eager = false,
  width,
  height,
}: {
  src: string;
  alt: string;
  /** Ancien titre de la barre de fenêtre, conservé pour compatibilité (non affiché). */
  title?: string;
  className?: string;
  eager?: boolean;
  width?: number;
  height?: number;
}) {
  const cutout = src.includes("-detoure");
  return (
    <figure className={`${cutout ? "" : "app-window"} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`block h-auto w-full ${cutout ? "drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" : ""}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={width}
        height={height}
      />
    </figure>
  );
}
