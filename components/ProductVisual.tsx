/* Shows the real product photo when one has been uploaded.
   Otherwise shows a neutral, clearly labelled stand-in until a photo is added in the admin. */

export function ProductVisual({
  src,
  alt,
  kind,
  className = "",
  priority = false,
  dark = false,
}: {
  src: string | null;
  alt: string;
  kind: "detergents" | "chemicals";
  className?: string;
  priority?: boolean;
  dark?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const stroke = dark ? "#A7EBF2" : "#26658C";
  return (
    <div
      role="img"
      aria-label={`${alt}. Photo not yet available.`}
      className={`relative flex h-full w-full items-center justify-center ${dark ? "bg-navy" : "bg-mist"} ${className}`}
    >
      <svg viewBox="0 0 80 96" className="h-[46%] max-h-32 opacity-70" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        {kind === "detergents" ? (
          <>
            <path d="M31 6h18v10H31z" />
            <path d="M33 16c0 8-13 10-13 24v44a6 6 0 0 0 6 6h28a6 6 0 0 0 6-6V40c0-14-13-16-13-24" />
            <path d="M20 48h40M20 72h40" />
          </>
        ) : (
          <>
            <ellipse cx="40" cy="14" rx="26" ry="7" />
            <path d="M14 14v68c0 3.9 11.6 7 26 7s26-3.1 26-7V14" />
            <path d="M14 38c0 3.9 11.6 7 26 7s26-3.1 26-7M14 60c0 3.9 11.6 7 26 7s26-3.1 26-7" />
          </>
        )}
      </svg>
      <span
        className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
          dark ? "bg-white/10 text-ice" : "bg-white text-ocean"
        }`}
      >
        Photo pending
      </span>
    </div>
  );
}
