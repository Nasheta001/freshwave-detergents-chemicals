export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-ice/80" : "text-ocean";
  return (
    <span className="flex items-center gap-2.5">
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <rect width="38" height="38" rx="10" fill={tone === "light" ? "#A7EBF2" : "#023859"} />
        <path
          d="M7 16.5c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3"
          fill="none"
          stroke={tone === "light" ? "#011C40" : "#A7EBF2"}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M7 24.5c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3"
          fill="none"
          stroke={tone === "light" ? "#26658C" : "#54ACBF"}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-[17px] font-extrabold sm:text-[19px] tracking-tight ${text}`}>FreshWave</span>
        <span className={`mt-1 whitespace-nowrap text-[8.5px] font-semibold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.16em] ${sub}`}>
          Detergents &amp; Chemicals
        </span>
      </span>
    </span>
  );
}
